import React, { useState, useEffect, useRef } from "react";

import "../../styles/ContainerModal.css";

import Loading from "../Loading";
import axios from "axios";

function ContainerShare({ isOpen, close, selectedContainerId }) {
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
  // 컨테이너 정보
  const [userNickname, setNickname] = useState("");
  const token = localStorage.getItem("Authorization");

  if (!isOpen) return null;
  const containerId = selectedContainerId.containerId;
  //----------------------------------------------------------------컨테이너 내용
  const onChangeNickname = (event) => {
    setNickname(event.target.value);
  };

  // 컨테이너 수정요청
  const ShareAPI = async () => {
    {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    try {
      const response = await axios.post(
        `/api/container/share`,
        { containerId, userNickname },
        {
          headers: { Authorization: token },
        }
      );
      if (response.status === 200) {
        alert("성공적으로 공유하셨습니다 :)");
        close();
      }
    } catch (error) {
      const errorRes = error.response.data;
      if (errorRes.code === "1201") {
        // 존재하지 않는 사용자 입니다.
        alert(error.response.data.description);
        console.error(errorRes.description);
      } else {
        alert(error.response.data.description);
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
    if (userNickname === "") {
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
