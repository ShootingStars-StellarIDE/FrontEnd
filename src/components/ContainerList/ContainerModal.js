import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ContainerModal.css";
import javaIco from "../../assets/JAVA.svg";
import pythonIco from "../../assets/python.svg";
import * as auth from "../../apis/auth";

function ContainerModal({ isOpen, close }) {
  const navigate = useNavigate();

  // 컨테이너 정보
  const [containerType, setContainerType] = useState("");
  const [containerName, setContainerName] = useState("");
  const [containerDescription, setContainerDescription] = useState("");

  if (!isOpen) return null;

  //----------------------------------------------------------------컨테이너 제목
  const onChangeContainerName = (event) => {
    setContainerName(event.target.value);
  }

  //----------------------------------------------------------------컨테이너 내용
  const onChangeContainerDescription = (event) => {
    setContainerDescription(event.target.value);
  }

  //----------------------------------------------------------------컨테이너 언어
  // 클릭 이벤트 핸들러
  const handleLangButtonClick = (lang) => {
    setContainerType(lang); // 클릭된 언어를 상태 변수에 설정
  };

  // 컨테이너 생성요청
  const createContainerApi = async (type, name, desc) => {
    let response = await auth.containerCreate(
      type,
      name,
      desc
    );
    return response;
  }

  // 언어버튼
  const langButton = (type, img) => {
    return (
      <img
        src={img}
        alt={type}
        onClick={() => handleLangButtonClick(type)}
        className={`${type} ${containerType === type ? "selected" : ""}`}
      />
    )
  }

  const createcontainer = (e) => {
    e.preventDefault();
    const form = e.target;

    const type = containerType;
    const name = form.containerName.value;
    const desc = form.containerDescription.value;

    let isValid = true;

    // type 검사
    if(containerType == null) {
      alert("타입을 선택해 주세요.");
      isValid = false;
    }
    if(containerName == null) {
      alert("이름을 입력해 주세요.");
      isValid = false;
    }
    if(containerDescription == null) {
      alert("설명을 입력해 주세요.");
      isValid = false;
    }

    if(!isValid) {
      return;
    } else {
      createContainerApi(type, name, desc);
    }

  }

  return (
    <form
      className="createContainer-Form"
      onSubmit={(e) => createcontainer(e)}
      // 엔터 키를 눌렀을 때 폼의 자동 제출 방지
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }
      }
    > 
      <div className="modal-backdrop">
        <div className="modal">
          <h3>컨테이너 타입</h3>
          <div className="lang-button-container">
              {langButton("JAVA", javaIco)}
              {langButton("PYTHON", pythonIco)}
          </div>
          <h3>프로젝트 이름</h3>
          <input 
            type="text" 
            placeholder="프로젝트 이름을 입력하세요" 
            name="containerName"
            value={containerName}
            onChange={onChangeContainerName}

          />
          <h3>프로젝트 설명</h3>
          <textarea
            type="text"
            placeholder="프로젝트 설명을 입력하세요..."
            name="containerDescription"
            value={containerDescription}
            onChange={onChangeContainerDescription}

          ></textarea>

          <div className="buttons">
            <button type="submit">프로젝트 생성</button>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    </form>
  );
}
export default ContainerModal;