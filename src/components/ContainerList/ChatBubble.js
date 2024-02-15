import React, { useState } from 'react';
import "../../styles/ChatBubble.css"

function ChatBubble() {
  const [isChatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && message.trim() !== '') {
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
            <button id="closeChat" onClick={toggleChat}>×</button>
          </div>
          <div className="chat-messages">
            {/* 메시지들이 표시될 부분 */}
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

export default ChatBubble;
