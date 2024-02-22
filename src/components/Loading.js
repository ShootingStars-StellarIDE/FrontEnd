import React from "react";
import "../styles/Loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className={"loading-p"}>데이터를 불러오는 중입니다...</p>
    </div>
  );
}

export default Loading;
