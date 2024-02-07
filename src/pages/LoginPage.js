import React from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const goToSearchEmail = () => {
    navigate(`/search-email`);
  };

  const goToSearchPassword = () => {
    navigate(`/search-password`);
  };

  const goToSignUp = () => {
    navigate(`/signup`);
  };

  return (
    <div className="Login-container">
      <div className="Login-Form">
        <h1>Logo</h1>
        <h1>로그인</h1>
        <div className="Login-email-container">
          <label for="Login-email">이메일</label>
          <input
            className="Login-input"
            type="text"
            id="Login-email"
            placeholder="이메일을 입력해주세요"
          />
          <div className="input-null"></div>
        </div>
        <div className="Login-password-container">
          <label for="Login-password">비밀번호</label>
          <input
            className="Login-input"
            type="password"
            id="Login-password"
            placeholder="비밀번호를 입력해주세요"
          />
          <div className="input-null"></div>
        </div>
        <button className="Login-login-button">로그인</button>
        <div className="search-email" onClick={goToSearchEmail}>
          이메일을 잊어버리셨나요?
        </div>
        <div className="search-password" onClick={goToSearchPassword}>
          비밀번호를 잊어버리셨나요?
        </div>
        <div className="Login-singupQA">
          <div>아직 회원이 아니신가요?</div>
          <div className="Login-gotosingup" onClick={goToSignUp}>
            회원 가입하기
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
