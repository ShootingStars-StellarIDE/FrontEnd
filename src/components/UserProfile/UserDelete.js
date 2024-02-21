import React, { useState } from "react";
import * as auth from "../../apis/auth";
import { useNavigate } from "react-router-dom";

const UserDelete = () => {
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onClickPassWordCheck = async () => {
    try {
      const checkPassword = await auth.checkPassword(password);
      console.log(checkPassword);
      if (checkPassword.status === 200) {
        console.log("인증 완료");
        alert("비밀번호가 인증되었습니다.");
        setIsVerified(true);
      }
    } catch (error) {
      console.log(error);
      const errorRes = error.response.data;
      if (errorRes.code === "1004") {
        // 잘못된 형식의 비밀번호입니다.
        console.error(errorRes.description);
      }
      //인증에 실패하였습니다.
      else if (errorRes.code === "0100") {
        console.error(errorRes.description);
      }
      // 잘못된 접근입니다.
      else if (errorRes.code === "0101") {
        console.error(errorRes.description);
      }
      //잘못된 Access Token 입니다.
      else if (errorRes.code === "0102") {
        console.error(errorRes.description);
      }
      //만료된 Access Token 입니다.
      else if (errorRes.code === "0103") {
        console.error(errorRes.description);
      }
      //지원하지 않는 Access Token 입니다.
      else if (errorRes.code === "0104") {
        console.error(errorRes.description);
      }
      //Claim이 빈 Access Token 입니다.
      else if (errorRes.code === "0105") {
        console.error(errorRes.description);
      }
      //존재하지 않는 사용자입니다.
      else if (errorRes.code === "1201") {
        console.error(errorRes.description);
      }
      //잘못된 패스워드입니다.
      else if (errorRes.code === "1104") {
        console.error(errorRes.description);
      }
    }
  };

  const onClickDeletePassWord = async () => {
    try {
      const deleteUser = await auth.deleteUser();
      console.log(deleteUser);
      if (deleteUser.status === 200) {
        localStorage.removeItem("Authorization");
        alert("성공적으로 회원탈퇴를 했습니다. 다음에 또 봐요 우리🥲");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      const errorRes = error.response.data;
      if (errorRes.code === "0100") {
        // 인증에 실패하였습니다.
        console.error(errorRes.description);
      }
      //잘못된 접근입니다.
      else if (errorRes.code === "0101") {
        console.error(errorRes.description);
      }
      // 잘못된 Access Token 입니다.
      else if (errorRes.code === "0102") {
        console.error(errorRes.description);
      }
      // 만료된 Access Token 입니다.
      else if (errorRes.code === "0103") {
        console.error(errorRes.description);
      }
      //지원하지 않는 Access Token 입니다.
      else if (errorRes.code === "0104") {
        console.error(errorRes.description);
      }
      //Claim이 빈 Access Token 입니다.
      else if (errorRes.code === "0105") {
        console.error(errorRes.description);
      }
      // 잘못된 Refresh Token 입니다.
      else if (errorRes.code === "0106") {
        console.error(errorRes.description);
      }
      //만료된 Refresh Token 입니다.
      else if (errorRes.code === "0107") {
        console.error(errorRes.description);
      }
      //지원하지 않는 Refresh Token 입니다.
      else if (errorRes.code === "0108") {
        console.error(errorRes.description);
      }
      //Claim이 빈 RefreshToken 입니다.
      else if (errorRes.code === "0109") {
        console.error(errorRes.description);
      }
      //존재하지 않는 사용자입니다.
      else if (errorRes.code === "1201") {
        console.error(errorRes.description);
      }
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        placeholder="비밀번호를 입력하세요"
        onChange={handlePasswordChange}
      />

      <button onClick={onClickPassWordCheck}>비밀번호 확인</button>
      <button disabled={!isVerified} onClick={onClickDeletePassWord}>
        회원 탈퇴
      </button>
    </div>
  );
};

export default UserDelete;
