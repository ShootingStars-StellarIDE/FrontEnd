import React, { useState, useRef, useEffect } from "react";
import "../../styles/ChatBubble.css";
import axios from "axios";

function ChatBubble(containerId) {
  const [isChatOpen, setChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]); // 메시지를 저장할 상태
  const [roomNumber, setRoomNumber] = useState(0);
  const [userNickname, setUserNickname] = useState("test1");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const webSocket = useRef(null);
  const messagesEndRef = useRef(null);
  const baseurl = process.env.REACT_APP_WS_PROXY;
  const token = localStorage.getItem("Authorization");
  const container = containerId.containerId;

  useEffect(() => {
    if (roomNumber !== 0) {
      webSocket.current = new WebSocket(baseurl + "ws/chat");
      function enterRoom() {
        let enterMsg = {
          type: "ENTER",
          sender: userNickname,
          msg: userNickname + "님이 입장하셨습니다.",
          roomId: roomNumber,
        };

        //sender 추후 수정
        webSocket.current.send(JSON.stringify(enterMsg));
      }

      webSocket.current.onopen = function (e) {
        console.log("open server!");
        enterRoom(webSocket.current);
      };

      webSocket.current.onmessage = function (e) {
        console.log(e.data);
        const currentMessage = JSON.parse(e.data);
        const currentTime = new Date();
        const messageWithTime = {
          ...currentMessage,
          createTime: currentTime.toISOString(),
        };

        setMessages((prev) => [...prev, messageWithTime]);
      };

      webSocket.current.onclose = function (e) {
        console.error("disconnect");
      };

      webSocket.current.onerror = function (e) {
        console.error(e);
      };
    }
    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, [roomNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/container/getRoomId/` + container, {
          headers: { Authorization: token },
        });

        if (res.status == 200) {
          setRoomNumber(res.data.roomId);
          setUserNickname(res.data.nickname);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/api/chat/container/loadHistory?roomId=` + roomNumber,
          {
            headers: { Authorization: token },
          }
        );

        if (res.status == 200) {
          setMessages((prev) => [...res.data.content, ...prev]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (roomNumber !== 0) fetchData();
  }, [roomNumber]);

  //메세지 보내기 버튼 눌렀을 떄..
  function sendMsg() {
    const msg = inputMessage.toString();
    let talkMsg = {
      type: "TALK",
      sender: userNickname,
      roomId: roomNumber,
      msg: msg,
    };
    if (webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(JSON.stringify(talkMsg));
    }
  }

  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputMessage.trim() !== "" && !e.repeat) {
      e.preventDefault(); // Enter 키 기본 동작 방지
      sendMessage();
    }
  };

  const sendMessage = () => {
    sendMsg();
    setInputMessage(""); // 전송후 입력창 비우기
  };

  //시간 포멧
  function formatDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const formattedTime = `${dateTime.getFullYear()}-${(
      "0" +
      (dateTime.getMonth() + 1)
    ).slice(-2)}-${("0" + dateTime.getDate()).slice(-2)} ${(
      "0" + dateTime.getHours()
    ).slice(-2)}:${("0" + dateTime.getMinutes()).slice(-2)}`;
    return formattedTime;
  }
  //----------------------------------------------------------------스크롤 맨밑으로
  // 메시지 목록이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // 스크롤을 맨 아래로 이동시키는 함수
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView();
    };

    // 채팅 창이 열릴 때 스크롤을 맨 밑으로 이동
    scrollToBottom();
  }, [isChatOpen]);

  //--------------------------------------------------------검색기능

  return (
    <div>
      {!isChatOpen && (
        <div className="bubble" onClick={toggleChat}>
          <button id="openChat">Chat</button>
        </div>
      )}

      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>{roomNumber}의 채팅</span>
            <button id="closeChat" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chat-search">
            <input type="text" placeholder="메시지 검색..." />
            <button className="chat-search-button">검색</button>

            <div className="search-navigation">
              <button className="search-prev-button">이전</button>
              <button className="search-next-button">다음</button>
            </div>
          </div>

          <div className="chat-messages">
            {messages
              .slice()
              .sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
              .map((msgObj, index) => {
                const isMine = msgObj.sender === userNickname;
                const isEnter = msgObj.type === "ENTER";
                const messageClass = isEnter
                  ? "enter"
                  : isMine
                  ? "mine"
                  : "other";

                return (
                  <div key={index} className={`message ${messageClass} `}>
                    {msgObj.type === "TALK" && (
                      <>
                        <div className="message-sender">{msgObj.sender}</div>
                        <div className="message-content">{msgObj.msg}</div>
                        <div className="message-metadata-talk">
                          <span>{formatDateTime(msgObj.createTime)}</span>
                        </div>
                      </>
                    )}
                    {msgObj.type === "ENTER" && (
                      <div className="enter-message-container">
                        <div className="enter-message-content">
                          {msgObj.msg}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>
          <div>
            <input
              className="chat-input"
              type="text"
              placeholder="메시지 입력..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyUp={handleKeyPress}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
