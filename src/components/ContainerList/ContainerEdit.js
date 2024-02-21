import React, { useState } from "react";

import "../../styles/ContainerModal.css";

import * as auth from "../../apis/auth";

function ContainerEdit({ isOpen, close, selectedContainerId }) {
  // 컨테이너 정보

  const [containerDescription, setContainerDescription] = useState("");

  if (!isOpen) return null;
  const containerId = selectedContainerId.containerId;
  console.log(containerId);
  //----------------------------------------------------------------컨테이너 내용
  const onChangeContainerDescription = (event) => {
    setContainerDescription(event.target.value);
  };

  // 컨테이너 수정요청
  const containerEditAPI = async (desc) => {
    try {
      const response = await auth.containerEdit(containerId, desc);
      console.log(response);
      if (response.status === 200) {
        alert("성공적으로 변경하셨습니다 :)");
        close();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editContainer = (e) => {
    const desc = containerDescription;

    if (!desc) {
      alert("설명을 입력해 주세요.");
      return;
    } else {
      containerEditAPI(desc);
    }
  };

  return (
    <div className="createContainer-Form">
      <div className="modal-backdrop">
        <div className="modal">
          <h3>📄수정 하기</h3>

          <h3>프로젝트 설명</h3>
          <textarea
            type="text"
            placeholder="프로젝트 수정 설명을 입력하세요..."
            name="containerDescription"
            value={containerDescription}
            onChange={onChangeContainerDescription}
          ></textarea>

          <div className="buttons">
            <button onClick={editContainer}>수정하기</button>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContainerEdit;
