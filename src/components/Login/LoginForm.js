import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Store/UserSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  function onChangeEmail(event) {
    const input = event.target.value;
    setEmail(input);
    if (input === "") {
      setEmailError("이메일을 작성해주세요."); // 입력 필드가 비었을 때의 에러 메시지를 업데이트
    } else {
      setEmailError(" "); // 입력이 시작되면 에러 메시지를 초기화
    }
  }

  const onChangePassword = (event) => {
    const input = event.target.value;
    setPassword(input);
    if (input === "") {
      setPasswordError("비밀번호를 작성해주세요."); // 입력 필드가 비었을 때의 에러 메시지를 업데이트
    } else {
      setPasswordError(" "); // 입력이 시작되면 에러 메시지를 초기화
    }
  };

  const onLogin = (e) => {
    e.preventDefault();

    let isValid = true;
    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordAuthCheck =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    // 이메일이 비어있는지 확인
    if (!email) {
      setEmailError("이메일을 작성해주세요.");
      isValid = false;
    } else if (!emailCheck.test(email)) {
      // 이메일 형식을 검사합니다.
      setEmailError("이메일 형식이 올바르지 않습니다.");
      isValid = false;
    } else {
      setEmailError(""); // 에러 메시지를 지웁니다.
    }

    // 비밀번호가 비어있는지 확인
    if (!password) {
      setPasswordError("비밀번호를 작성해주세요.");
      isValid = false;
    } else if (!passwordAuthCheck.test(password)) {
      // 비밀번호 형식을 검사합니다.
      setPasswordError("비밀번호 형식이 올바르지 않습니다.");
      isValid = false;
    } else {
      setPasswordError(""); // 에러 메시지를 지웁니다.
    }

    // 이메일과 비밀번호가 모두 유효한 경우 로그인 로직을 수행
    if (isValid) {
      let userCredentials = { email, password };
      dispatch(loginUser(userCredentials)).then((result) => {
        if (result.type === "user/loginUser/fulfilled") {
          navigate(`/dashboard/containers`);
        }
      });
    }
  };

  return (
    <div className="Login-container">
      <form className="Login-Form" onSubmit={(e) => onLogin(e)}>
        <h1>Logo</h1>
        <h1>로그인</h1>
        <div className="Login-email-container">
          <label htmlFor="Login-email">이메일</label>
          <input
            className="Login-input"
            type="email"
            id="Login-email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={onChangeEmail}
          />
          <div className="input-null"></div>
        </div>
        {emailError && (
          <div className="error-message is-error">{emailError}</div>
        )}
        <div className="Login-password-container">
          <label htmlFor="Login-password">비밀번호</label>
          <input
            className="Login-input"
            type="password"
            id="Login-password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={onChangePassword}
          />
          <div className="input-null"></div>
        </div>
        {passwordError && (
          <div className="error-message is-error">{passwordError}</div>
        )}

        <button className="Login-login-button" type="submit">
          {loading ? "처리중" : "로그인"}
        </button>

        <div className="Login-signupQA">
          <div>아직 회원이 아니신가요?</div>
          <Link to="/signup" className="Login-gotosignup">
            회원 가입하기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
