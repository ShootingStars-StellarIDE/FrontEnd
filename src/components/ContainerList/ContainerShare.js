import React, { useState, useEffect, useRef } from "react";

import "../../styles/ContainerModal.css";
import javaIco from "../../assets/JAVA.svg";
import pythonIco from "../../assets/python.svg";
import * as auth from "../../apis/auth";
import Loading from "../Loading";

function ContainerShare({ isOpen, close, selectedContainerId }) {
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
  // 컨테이너 정보
  const [Nickname, setNickname] = useState("");

  if (!isOpen) return null;
  const containerId = selectedContainerId.containerId;
  console.log(containerId);
  //----------------------------------------------------------------컨테이너 내용
  const onChangeNickname = (event) => {
    setNickname(event.target.value);
  };

  // 컨테이너 수정요청
  const ShareAPI = async () => {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    try {
      const response = await auth.containerShare(containerId, Nickname);
      console.log(response);
      if (response.status === 200) {
        alert("성공적으로 공유하셨습니다 :)");
        close();
      }
    } catch (error) {
      const errorRes = error.response.data;
      if (errorRes.code === "1201") {
        // 존재하지 않는 사용자 입니다.
        console.error(errorRes.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  };

  const share = (e) => {
    if (Nickname === "") {
      alert("닉네임을 입력해 주세요.");
      return;
    } else {
      ShareAPI();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="createContainer-Form">
      <div className="modal-backdrop">
        <div className="modal">
          <h3>🔗공유 하기</h3>

          <input
            type="text"
            placeholder="공유받을 분의 닉네임을 정확히 입력 해주세요!"
            name="nickname"
            onChange={onChangeNickname}
          />

          <div className="buttons">
            <button onClick={share}>공유하기</button>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContainerShare;
