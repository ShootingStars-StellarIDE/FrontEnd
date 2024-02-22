import React, { useRef, useState } from "react";

import "../../styles/ContainerModal.css";

import * as auth from "../../apis/auth";
import Loading from "../Loading";

function ContainerEdit({ editOwner, isOpen, close, selectedContainerId }) {
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
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
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    try {
      const response = await auth.containerEdit(containerId, desc);
      console.log(response);
      if (response.status === 200) {
        alert("성공적으로 변경하셨습니다 :)");
        editOwner(containerId, desc);
        close();
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
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

  if (isLoading) {
    return <Loading />;
  }
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
