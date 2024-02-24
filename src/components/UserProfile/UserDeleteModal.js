import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DeleteUserModal.css";
import Loading from "../Loading";
import axios from "axios";

const UserDeleteModal = ({ isOpen, close }) => {
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("비밀번호 인증을 해주세요.");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
  const token = localStorage.getItem("Authorization");

  if (!isOpen) return null;

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

  const onClickDeletePassWord = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const deleteUser = await axios.delete(`/api/auth/delete/user`, {
        headers: { Authorization: token },
      });
      if (deleteUser.status === 200) {
        localStorage.removeItem("Authorization");
        alert("성공적으로 회원탈퇴를 했습니다. 다음에 또 봐요 우리🥲");
        navigate("/");
      }
    } catch (error) {
      const errorRes = error.response.data;
      if (errorRes.code === "0100") {
        // 인증에 실패하였습니다.
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //잘못된 접근입니다.
      else if (errorRes.code === "0101") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      // 잘못된 Access Token 입니다.
      else if (errorRes.code === "0102") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      // 만료된 Access Token 입니다.
      else if (errorRes.code === "0103") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //지원하지 않는 Access Token 입니다.
      else if (errorRes.code === "0104") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //Claim이 빈 Access Token 입니다.
      else if (errorRes.code === "0105") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      // 잘못된 Refresh Token 입니다.
      else if (errorRes.code === "0106") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //만료된 Refresh Token 입니다.
      else if (errorRes.code === "0107") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //지원하지 않는 Refresh Token 입니다.
      else if (errorRes.code === "0108") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //Claim이 빈 RefreshToken 입니다.
      else if (errorRes.code === "0109") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
      //존재하지 않는 사용자입니다.
      else if (errorRes.code === "1201") {
        setErrorMsg(errorRes.description);
        console.error(errorRes.description);
      }
    } finally {
      setIsLoading(false);
      isFirstLoading.current = false;
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="createContainer-Form">
      <div className="modal-backdrop">
        <div className="modal">
          <h3 className="title">회원 탈퇴</h3>

          <div className={`error ${isVerified ? "is-valid" : ""}`}>
            {errorMsg}
          </div>
          <h3 className="password-recheck">비밀번호 확인</h3>
          <div className="password-check">
            <input
              id="password-input"
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={handlePasswordChange}
            />
            <button className="buttons-check" onClick={onClickPassWordCheck}>
              확인하기
            </button>
          </div>
          <h6 style={{ color: "red", margin: 0 }}>
            회원 탈퇴시, 기존 회원의 정보와 컨테이너 목록이 사라집니다.
          </h6>
          <div className="modal-button-container">
            <button
              className="buttons-delete"
              onClick={onClickDeletePassWord}
              disabled={!isVerified}
            >
              탈퇴하기
            </button>
            <button className="buttons-delete" onClick={close}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
