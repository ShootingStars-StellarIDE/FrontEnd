import { Form } from "react-router-dom";
import "../styles/SignUp.css";
import { useState } from "react";

function SignUpPage() {
  const nicknameList = ["test", "test1", "test2", "test3", "test4"];

  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [emailAuthError, setEmailAuthError] = useState(" ");
  const [nicknameError, setNicknameError] = useState(
    " 닉네임은 영어 소문자와 숫자로 5~20자로 이루어져야 합니다"
  );

  const [passwordError, setPasswordError] = useState(
    "(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요"
  );
  const [rePassword, setRePassword] = useState(" ");
  const [rePasswordError, setRePasswordError] = useState(" ");

  function onChangeEmail(event) {
    setEmail(event.target.value);
  }

  function onClickEmailAuth(event) {
    if (email.includes("@") === false) {
      setEmailError("이메일이 올바르지 않습니다. @가 포함된 형식을 써주세요");
    } else {
      setEmailError("올바르게 전송되었습니다.");
    }
  }

  function onChangeEmailAuth(event) {
    setAuthCode(event.target.value);
  }

  function onClickCheckAuthCode(event) {
    if (authCode !== "abcdefgh") {
      setEmailAuthError("코드가 불일치합니다. 확인해주세요");
    } else {
      setEmailAuthError("인증되었습니다.");
    }
  }

  function onChangeNickname(event) {
    setNickname(event.target.value);
  }

  function onClickNickname(event) {
    const nicknameCheck = /^[a-z0-9]{5,20}$/;

    if (!nicknameCheck.test(nickname)) {
      setNicknameError("닉네임이 조건에 맞지 않습니다.");
    } else if (nicknameList.includes(nickname)) {
      setNicknameError(
        "이미 사용중인 닉네임입니다. 다른 닉네임을 사용해주세요."
      );
    } else {
      setNicknameError("사용가능한 닉네임입니다.");
    }
  }

  const onChangePassword = (event) => {
    setPassword(event.target.value); // 비밀번호 상태를 업데이트
  };

  // onKeyUp 이벤트 핸들러
  const onKeyUpPassword = (event) => {
    // 엔터 키가 눌렸는지 확인
    if (event.key === "Enter") {
      // 입력된 비밀번호가 없으면 기본 안내문을 다시 설정
      if (!event.target.value) {
        setPasswordError("(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요");
      } else {
        PasswordAuthCheck(event.target.value);
      }
    }
  };

  function PasswordAuthCheck(inputPassword) {
    const passwordAuthCheck =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordAuthCheck.test(inputPassword)) {
      setPasswordError("비밀번호가 조건에 맞지 않습니다.");
    } else {
      setPasswordError("사용 가능한 비밀번호입니다.");
    }
  }

  const onChangeRePassword = (event) => {
    setRePassword(event.target.value);
  };

  // 비밀번호 확인 검사 함수
  const checkRePassword = () => {
    if (rePassword === "") {
      setRePasswordError("");
    } else if (password !== rePassword) {
      setRePasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setRePasswordError("비밀번호가 일치합니다.");
    }
  };

  return (
    <div className="Signup-container">
      <div className="Signup-Form">
        <h1>회원가입</h1>
        <div className="Signup-email-container">
          <label htmlFor="Signup-email">이메일</label>
          <input
            className="signup-input"
            type="text"
            id="Signup-email"
            placeholder="이메일을 입력해주세요"
            onChange={onChangeEmail}
          />
          <button className="Signup-auth-button" onClick={onClickEmailAuth}>
            인증하기
          </button>
        </div>
        {emailError && (
          <div
            className={`error-message ${
              emailError === "올바르게 전송되었습니다."
                ? "is-valid"
                : "is-error"
            }`}
          >
            {emailError}
          </div>
        )}

        <div className="Signup-emailAuth-container">
          <label htmlFor="Signup-emailAuth">이메일인증</label>
          <input
            className="signup-input"
            type="text"
            id="Signup-emailAuth"
            placeholder="인증코드를 입력해주세요"
            onChange={onChangeEmailAuth}
          />
          <button className="Signup-auth-button" onClick={onClickCheckAuthCode}>
            확인
          </button>
        </div>
        {emailAuthError && (
          <div
            className={`error-message ${
              emailAuthError
                ? emailAuthError === "인증되었습니다."
                  ? "is-valid"
                  : "is-error"
                : ""
            }`}
            style={{ visibility: emailAuthError ? "visible" : "hidden" }}
          >
            {emailAuthError || ""}
          </div>
        )}

        <div className="Signup-nickname-container">
          <label htmlFor="Signup-nickname">닉네임</label>
          <input
            className="signup-input"
            type="text"
            id="Signup-nickname"
            placeholder=" 입력해주세요"
            onChange={onChangeNickname}
          />
          <button className="Signup-auth-button" onClick={onClickNickname}>
            중복검사
          </button>
        </div>
        {nicknameError && (
          <div
            className={`error-message ${
              nicknameError === "사용가능한 닉네임입니다."
                ? "is-valid"
                : nicknameError &&
                  nicknameError !==
                    " 닉네임은 영어 소문자와 숫자로 5~20자로 이루어져야 합니다"
                ? "is-error"
                : "" // 입력 내용이 없거나 초기 안내문일 때는 아무 추가 클래스도 적용하지 않음
            }`}
          >
            {nicknameError}
          </div>
        )}

        <div className="Signup-password-container">
          <label htmlFor="Signup-password">비밀번호</label>
          <input
            className="signup-input"
            type="password"
            id="Signup-password"
            placeholder="비밀번호를 입력해주세요"
            onChange={onChangePassword} // 비밀번호를 입력할 때마다 상태 업데이트
            onKeyUp={onKeyUpPassword}
          />
          <div className="input-null"></div>
        </div>
        {passwordError && (
          <div
            className={`error-message ${
              passwordError === "사용 가능한 비밀번호입니다."
                ? "is-valid"
                : passwordError &&
                  passwordError !==
                    "(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요"
                ? "is-error"
                : "" // 입력 내용이 없거나 초기 안내문일 때는 아무 추가 클래스도 적용하지 않음
            }`}
          >
            {passwordError}
          </div>
        )}

        <div className="Signup-re-password-container">
          <label htmlFor="Signup-re-password">비밀번호 확인</label>
          <input
            className="signup-input"
            type="password"
            id="Signup-re-password"
            placeholder="비밀번호를 다시 입력해주세요"
            onChange={onChangeRePassword}
            onKeyUp={checkRePassword}
          />
          <div className="input-null"></div>
        </div>
        {rePasswordError && (
          <div
            className={`error-message ${
              rePasswordError === "비밀번호가 일치합니다."
                ? "is-valid"
                : "is-error"
            }`}
          >
            {rePasswordError}
          </div>
        )}
        <button className="Signup-signup-button">회원가입</button>
      </div>
    </div>
  );
}

export default SignUpPage;
