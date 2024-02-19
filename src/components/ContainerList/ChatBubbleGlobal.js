import React, { useState } from "react";
import "../../styles/ChatBubble.css";
import axios from "axios";

function ChatBubbleGlobal() {
  const [isChatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // 메시지를 저장할 상태

  function enterRoom(socket) {
    let enterMsg = {
      type: "ENTER",
      sender: "chatRoom.html수정 container소유주",
      msg: "",
    };
    //sender 추후 수정
    socket.send(JSON.stringify(enterMsg));
  }
  let socket = new WebSocket("ws://localhost:8080/ws/chat");

  socket.onopen = function (e) {
    console.error("open server!");
    enterRoom(socket);
  };
  socket.onclose = function (e) {
    console.error("disconnet");
  };

  socket.onerror = function (e) {
    console.error(e);
  };

  //메세지 수신했을 때 이벤트.
  socket.onmessage = function (e) {
    console.log(e.data);
    let msgArea = document.querySelector(".msgArea");
    let newMsg = document.createElement("div");
    newMsg.innerText = e.data;
    msgArea.append(newMsg);
  };

  //메세지 보내기 버튼 눌렀을 떄..
  function sendMsg() {
    let content = document.querySelector(".content").value;
    var talkMsg = { type: "TALK", sender: "sender", msg: content };
    //sender 수정
    socket.send(JSON.stringify(talkMsg));
  }

  //방 나가기 햇을때
  function quit() {
    socket.close();
  }

  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    console.log(message); // 서버로 메시지 보내기
    setMessage(""); // 전송후 입력창 비우기
  };

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
            <span>채팅</span>
            <button id="closeChat" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.sender}:</strong> {msg.message}
                <span className="timestamp">{msg.createTime}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="메시지 입력..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBubbleGlobal;
