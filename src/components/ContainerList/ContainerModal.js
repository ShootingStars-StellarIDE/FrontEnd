// import React from "react";
import React, { useState } from "react";
import "../../styles/ContainerModal.css";

function ContainerModal({ isOpen, close }) {
  const [selectedLang, setSelectedLang] = useState(""); // 선택된 언어를 저장하는 상태 변수

  if (!isOpen) return null;

  // 클릭 이벤트 핸들러
  const handleLangButtonClick = (lang) => {
    setSelectedLang(lang); // 클릭된 언어를 상태 변수에 설정
  };

  // const handleSelectDescBtnClick = () => {
  //   if (selectedLang) {
  //     const encodeLang = encodeURIComponent(selectedLang);
  //     navigate(`/${encodeLang}/list`);
  //   } else {
  //     openModal();
  //   }
  // };

  const langButton = (type, img) => {
    return (
      <img
        src={img}
        alt={type}
        onClick={() => handleLangButtonClick(type)}
        className={`${type} ${selectedLang === type ? "selected" : ""}`}
      />
    )
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="lang-button-container">
          {langButton("JAVA")}
          {langButton("JS")}
          {langButton("CPP")}
          {langButton("PYTHON")}
        </div>
        <h3>프로젝트 이름</h3>
        <input type="text" placeholder="프로젝트 이름을 입력하세요." />
        <h3>프로젝트 설명</h3>
        <textarea placeholder="프로젝트 설명을 입력하세요."></textarea>
        <div className="buttons">
          <button onClick={close}>프로젝트 생성</button>
          <button onClick={close}>닫기</button>
        </div>
      </div>
    </div>
  );
}
export default ContainerModal;