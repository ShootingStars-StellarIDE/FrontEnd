import React, { useState, useEffect, useRef } from "react";

import "../../styles/ContainerModal.css";

import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import axios from "axios";

function ContainerDelete({ removeOwner, selectedContainerId, isOpen, close }) {
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("비밀번호를 인증해주세요.");
  const navigate = useNavigate();
  const token = localStorage.getItem("Authorization");

  if (!isOpen) return null;

  const containerId = selectedContainerId.containerId;
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onClickPassWordCheck = async () => {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    try {
      const checkPassword = await axios.post(
        `./api/auth/checkPassword`,
        { password },
        { headers: { Authorization: token } }
      );

      if (checkPassword.status === 200) {
        setErrorMsg("비밀번호가 인증되었습니다.");
        setIsVerified(true);
      }
    } catch (error) {
      const errorRes = error.response.data;
      if (errorRes.code === "1004") {
        // 잘못된 형식의 비밀번호입니다.
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //인증에 실패하였습니다.
      else if (errorRes.code === "0100") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      // 잘못된 접근입니다.
      else if (errorRes.code === "0101") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //잘못된 Access Token 입니다.
      else if (errorRes.code === "0102") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //만료된 Access Token 입니다.
      else if (errorRes.code === "0103") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //지원하지 않는 Access Token 입니다.
      else if (errorRes.code === "0104") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //Claim이 빈 Access Token 입니다.
      else if (errorRes.code === "0105") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //존재하지 않는 사용자입니다.
      else if (errorRes.code === "1201") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
      //잘못된 패스워드입니다.
      else if (errorRes.code === "1104") {
        console.error(errorRes.description);
        setErrorMsg(errorRes.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  };

  const onClickDeleteContainer = async () => {
    {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    try {
      const deleteContainer = await axios.delete(
        `/api/container/delete/${containerId}`,

        { headers: { Authorization: token } }
      );

      if (deleteContainer.status === 200) {
        alert("성공적으로 컨테이너를 삭제했습니다.");
        removeOwner(containerId);
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
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="createContainer-Form">
      <div className="modal-backdrop">
        <div className="modal">
          <h3 className="title">컨테이너 삭제</h3>

          <div className={`error ${isVerified ? "is-valid" : ""}`}>
            {errorMsg}
          </div>
          <h3 className="password-recheck">비밀번호 확인</h3>
          <div className="obj">
            <input
              id="password-input"
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={handlePasswordChange}
            />
            <button onClick={onClickPassWordCheck}>확인하기</button>
          </div>
          <div className="buttons">
            <button onClick={onClickDeleteContainer} disabled={!isVerified}>
              삭제하기
            </button>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContainerDelete;
