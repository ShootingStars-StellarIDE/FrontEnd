import React, { useState, useRef, useEffect } from "react";
import "../../styles/ChatBubble.css";

function ChatBubbleGlobal({ nickname }) {
  const [isChatOpen, setChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]); // 메시지를 저장할 상태
  const roomNumber = 999;
  const [userNickname, setUserNickname] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [searchIndexes, setSearchIndexes] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  const webSocket = useRef(null);
  const messagesEndRef = useRef(null);
  const baseurl = process.env.REACT_APP_WS_PROXY;

  useEffect(() => {
    setUserNickname(nickname);
  }, [nickname]);

  useEffect(() => {
    if (userNickname !== "") {
      webSocket.current = new WebSocket(baseurl + "ws/chat");
      function enterRoom() {
        let enterMsg = {
          type: "ENTER",
          sender: userNickname,
          msg: userNickname + "님이 입장하셨습니다.",
          roomId: roomNumber,
          roomType: "GLOBAL",
        };

        //sender 추후 수정
        webSocket.current.send(JSON.stringify(enterMsg));
      }

      webSocket.current.onopen = function (e) {
        enterRoom(webSocket.current);
      };

      webSocket.current.onmessage = function (e) {
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
  }, [userNickname]);

  function sendMsg() {
    const msg = inputMessage.toString();
    let talkMsg = {
      type: "TALK",
      sender: userNickname,
      roomId: roomNumber,
      msg: msg,
      roomType: "GLOBAL",
    };
    if (webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(JSON.stringify(talkMsg));
    }
  }

  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Esc 키를 누르면 채팅창 닫기
      if (e.key === "Escape") {
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const sendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage) {
      sendMsg(trimmedMessage);
      setInputMessage("");
      // 검색어가 비어있을 경우, searchResults도 업데이트
      if (!searchTerm.trim()) {
        setSearchResults([
          ...messages,
          {
            /* 새 메시지 객체 */
          },
        ]);
      }
    }
  };

  //----------------------------------------------------------------시간 포멧

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
  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      // 스크롤을 맨 아래로 이동
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
      };

      scrollToBottom();
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 0);
    }
  }, [messages]);

  //--------------------------------------------------------검색기능
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const handleMessage = (e) => {
      const newMessage = JSON.parse(e.data);
      const messageWithTime = {
        ...newMessage,
        createTime: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageWithTime]);
      if (searchTerm) {
        // 검색 결과 업데이트 로직
        const updatedSearchResults = [
          ...searchResults,
          highlightMessage(messageWithTime, searchTerm),
        ];
        setSearchResults(updatedSearchResults);
      }
    };

    if (webSocket.current) {
      webSocket.current.onmessage = handleMessage;
    }

    // Cleanup function
    return () => {
      if (webSocket.current) {
        webSocket.current.onmessage = null;
      }
    };
  }, [searchTerm, searchResults]);

  useEffect(() => {
    const updateSearchResultsWithNewMessage = (newMessage) => {
      if (
        !searchTerm ||
        newMessage.msg.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        const highlightedMessage = highlightMessage(newMessage, searchTerm);
        setSearchResults((prevResults) => [...prevResults, highlightedMessage]);
      }
    };
  }, [searchTerm, setSearchResults]);

  const highlightMessage = (message, searchTerm) => {
    if (
      !searchTerm ||
      !message.msg.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return message;
    }

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const highlightedMsg = message.msg
      .split("\n")
      .map((line, lineIndex, array) => (
        <React.Fragment key={lineIndex}>
          {line.split(regex).map((part, partIndex) =>
            regex.test(part) ? (
              <span key={partIndex} className="highlight">
                {part}
              </span>
            ) : (
              part
            )
          )}
          {lineIndex < array.length - 1 ? <br /> : null}
        </React.Fragment>
      ));

    return {
      ...message,
      highlightedMsg: <React.Fragment>{highlightedMsg}</React.Fragment>,
    };
  };

  const searchStart = () => {
    setSearchResults(
      messages.map((message) => highlightMessage(message, searchTerm))
    );

    const indexes = messages.reduce((acc, message, index) => {
      if (message.msg.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc.push(index);
      }
      return acc;
    }, []);

    setSearchIndexes(indexes);
    if (indexes.length > 0) {
      const lastIndex = indexes.length - 1;
      setCurrentSearchIndex(lastIndex);
      scrollToMessage(indexes[lastIndex]);
    } else {
      setCurrentSearchIndex(-1);
    }
  };

  const renderMessageContent = (messageObj) => {
    const content = messageObj.highlightedMsg
      ? messageObj.highlightedMsg
      : messageObj.msg.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < messageObj.msg.split("\n").length - 1 && <br />}
          </React.Fragment>
        ));

    return content;
  };

  //----------------------------------------------------------------검색어 스크롤
  const scrollToMessage = (index) => {
    const messageElement = document.getElementById(`message-${index}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        messageElement.classList.add("shake-animation");

        setTimeout(
          () => messageElement.classList.remove("shake-animation"),
          500
        );
      }, 500);
    }
  };

  const goToPrevSearchResult = () => {
    if (currentSearchIndex > 0) {
      const newIndex = currentSearchIndex - 1;
      setCurrentSearchIndex(newIndex);
      scrollToMessage(searchIndexes[newIndex]);
    } else {
      alert("더 이상 관련 채팅이 없습니다.");
    }
  };

  const goToNextSearchResult = () => {
    if (currentSearchIndex < searchIndexes.length - 1) {
      const newIndex = currentSearchIndex + 1;
      setCurrentSearchIndex(newIndex);
      scrollToMessage(searchIndexes[newIndex]);
    } else {
      alert("더 이상 관련 채팅이 없습니다.");
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(messages); // 검색어가 비었을 때 원래 메시지 목록으로 검색 결과를 초기화
      setSearchIndexes([]);
      setCurrentSearchIndex(-1);
    } else {
      // 검색어가 있을 때 검색 로직 실행
      const handleMessage = (e) => {
        // 검색 로직
      };
      if (webSocket.current) webSocket.current.onmessage = handleMessage;
    }
  }, [searchTerm, messages]);

  //----------------------------------------------------------------
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
            <span>✨접속자들과 대화를 나눠보세요!✨</span>
            <button id="closeChat" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chat-search">
            <input
              type="text"
              placeholder="검색할 단어를 입력해주세요."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <button
              className="chat-search-button"
              onClick={searchStart}
              disabled={!searchTerm.trim()}
            >
              검색
            </button>
            {searchIndexes.length > 0 && (
              <div className="search-navigation">
                <button
                  className="search-prev-button"
                  onClick={goToPrevSearchResult}
                >
                  이전
                </button>
                <button
                  className="search-next-button"
                  onClick={goToNextSearchResult}
                >
                  다음
                </button>
              </div>
            )}
          </div>

          <div className="chat-messages">
            {(searchResults.length !== 0 ? searchResults : messages)
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
                  <div
                    key={index}
                    id={`message-${index}`}
                    className={`message ${messageClass}`}
                  >
                    {msgObj.type === "TALK" && (
                      <div>
                        <div className="message-sender">{msgObj.sender}</div>
                        <div className="message-content">
                          {renderMessageContent(msgObj)}
                        </div>
                        <div className="message-metadata-talk">
                          <span>{formatDateTime(msgObj.createTime)}</span>
                        </div>
                      </div>
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

          <div className="chat-line">
            <hr />
          </div>

          <div className="text-area">
            <textarea
              className="chat-input"
              type="text"
              placeholder="메시지 입력해주세요."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default ChatBubbleGlobal;
