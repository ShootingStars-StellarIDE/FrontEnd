import React, { useRef, useState } from "react";
import Loading from "../Loading";

const SignupForm = ({
  join,
  sendEmailAuthRequest,
  CodeCheck,
  nickNameCheck,
  emailCheck,
}) => {
  //----------------------------------------------------------------state
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(
    "(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요(허용 특수문자:@$!%*#?&)"
  );
  const [emailError, setEmailError] = useState(" ");
  const [emailAuthError, setEmailAuthError] = useState(" ");
  const [nicknameError, setNicknameError] = useState(
    " 닉네임은 영어 소문자와 숫자로 5~20자로 이루어져야 합니다"
  );

  const [rePassword, setRePassword] = useState(" ");
  const [rePasswordError, setRePasswordError] = useState(" ");
  const [isEmailAuthed, setIsEmailAuthed] = useState(false); // 이메일 인증 성공 여부
  const [isCodeAuthed, setIsCodeAuthed] = useState(false); // 코드 인증 성공 여부

  //----------------------------------------------------------------이메일 관련
  function onChangeEmail(event) {
    setEmail(event.target.value);
    if (isEmailAuthed) setIsEmailAuthed(false); // 이메일을 변경하면 인증 상태 초기화
  }

  async function onClickEmailAuth(event) {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    event.preventDefault(); // 버튼의 기본 동작 방지

    const emailCheck2 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailCheck2.test(email)) {
      setEmailError("이메일이 올바르지 않습니다. @가 포함된 형식을 써주세요");
      return; // 유효하지 않은 이메일 형식이므로 여기서 함수 종료
    }

    try {
      // 이메일 중복 검사 실행
      const duplicateResult = await emailCheck(email);
      console.log(email);
      // 정상적인 응답 처리
      if (duplicateResult.status == 200) {
        // 중복된 이메일이 없는 경우, 이메일 인증 요청 실행
        try {
          const sendEmailRequest = await sendEmailAuthRequest(email);
          console.log(email);
          if (sendEmailRequest.status == 200) {
            setEmailError("올바르게 전송되었습니다. 메일을 확인해주세요.");
            setIsEmailAuthed(true); // 인증 성공 상태 업데이트
          }
        } catch (error) {
          if (error.response.data.code == 1001) {
            // 잘못된 형식의 이메일입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
          //잘못된 형식의 닉네임입니다.
          else if (error.response.data.code == 1003) {
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
          // 잘못된 형식의 비밀번호입니다.
          else if (error.response.data.code == 1004) {
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
          //인증이 만료되었거나 인증되지 않은 이메일입니다.
          else if (error.response.data.code == 1102) {
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
          //허용되지 않는 닉네임입니다.
          else if (error.response.data.code == 1303) {
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
          //이미 사용중인 이메일입니다.
          else if (error.response.data.code == 1301) {
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
          //이미 사용중인 닉네임입니다.
          else if (error.response.data.code == 1302) {
            alert(error.response.data.description);
            console.error(error.response.data.description);
          }
        } finally {
          if (isFirstLoading) {
            setIsLoading(false); // 데이터 불러오기 완료
            isFirstLoading.current = false;
          }
        }
      }
    } catch (error) {
      // console.log(error.response.data.description);
      // 오류 처리
      if (error.response.data.code == 1301) {
        // 이미 사용중인 이메일입니다.
        alert(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code == 1001) {
        // 잘못된 형식의 이메일입니다.
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  }

  //----------------------------------------------------------------이메일 인증코드 관련

  function onChangeEmailAuth(event) {
    setCode(event.target.value);
  }

  async function onClickCheckAuthCode(event) {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    event.preventDefault(); // 폼 제출을 방지

    try {
      const response = await CodeCheck(email, code);

      // 응답 상태 코드가 200인 경우
      if (response.status == 200) {
        setEmailAuthError("인증되었습니다.");
        setIsCodeAuthed(true); // 코드 인증 성공 상태 업데이트
      }
    } catch (error) {
      // 잘못된 형식의 이메일입니다.
      if (error.response.data.code == 1001) {
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
      //잘못된 형식의 인증코드입니다.
      else if (error.response.data.code == 1002) {
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
      //잘못된 키 혹은 잘못(만료) 된 인증 코드입니다.
      else if (error.response.data.code == 1101) {
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  }

  //----------------------------------------------------------------닉네임 관련

  function onChangeNickname(event) {
    setNickname(event.target.value);
  }

  async function onClickNickname(event) {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    const nicknameCheckRegex = /^[a-z0-9]{5,20}$/;

    if (!nicknameCheckRegex.test(nickname)) {
      setNicknameError("닉네임이 조건에 맞지 않습니다.");
      return;
    }

    try {
      // API를 통한 닉네임 중복 검사
      const response = await nickNameCheck(nickname);

      if (response.status == 200) {
        setNicknameError("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      // 잘못된 형식의 이메일입니다.
      if (error.response.data.code == 1001) {
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
      //허용되지 않는 닉네임입니다.
      else if (error.response.data.code == 1303) {
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
      //이미 사용중인 닉네임입니다.
      else if (error.response.data.code == 1302) {
        alert(error.response.data.description);
        console.error(error.response.data.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  }
  //----------------------------------------------------------------비밀번호 관련
  const onChangePassword = (event) => {
    setPassword(event.target.value); // 비밀번호 상태를 업데이트
  };

  const onKeyUpPassword = (event) => {
    event.preventDefault();
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordAuthCheck.test(inputPassword)) {
      setPasswordError("비밀번호가 조건에 맞지 않습니다.");
    } else {
      setPasswordError("사용 가능한 비밀번호입니다.");
    }
  }

  //----------------------------------------------------------------비밀번호 재확인 관련

  const onChangeRePassword = (event) => {
    setRePassword(event.target.value);
  };

  const checkRePassword = () => {
    if (rePassword === "") {
      setRePasswordError("");
    } else if (password !== rePassword) {
      setRePasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setRePasswordError("비밀번호가 일치합니다.");
    }
  };

  //--------------------------------------------------------
  //회원가입 제출

  const onJoin = async (e) => {
    e.preventDefault(); // submit 기본 동작 방지

    const form = e.target;
    const email = form.email.value;
    const nickname = form.nickname.value;
    const password = form.password.value;

    let isValid = true;

    // 이메일 검사

    if (emailError !== "올바르게 전송되었습니다. 메일을 확인해주세요.") {
      setEmailError("작성을 완료해주세요.");
      isValid = false;
    }

    // 이메일 인증 검사

    if (emailAuthError !== "인증되었습니다.") {
      setEmailAuthError("작성을 완료해주세요.");
      isValid = false;
    }

    // 닉네임 검사

    if (nicknameError !== "사용 가능한 닉네임입니다.") {
      setNicknameError("작성을 완료해주세요.");
      isValid = false;
    }

    // 비밀번호 검사

    if (passwordError !== "사용 가능한 비밀번호입니다.") {
      setPasswordError("작성을 완료해주세요.");
      isValid = false;
    }

    // 비밀번호 확인 검사

    if (rePasswordError !== "비밀번호가 일치합니다.") {
      setRePasswordError("작성을 완료해주세요.");
      isValid = false;
    }

    // 모든 유효성 검사를 통과하지 못한 경우 함수 종료
    if (!isValid) {
      return;
    } else {
      console.log(email, password, nickname);
      join({ email, nickname, password });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="Signup-container">
      <form
        className="Signup-Form"
        onSubmit={(e) => onJoin(e)}
        onKeyDown={(e) => {
          // 엔터 키를 눌렀을 때의 동작
          if (e.key === "Enter") {
            e.preventDefault(); // 폼의 자동 제출 방지
            // 필요한 경우, 여기서 추가적인 로직을 실행할 수 있다
          }
        }}
      >
        <h1>회원가입</h1>
        <div className="Signup-email-container">
          <label htmlFor="Signup-email">이메일</label>
          <input
            className="signup-input"
            type="text"
            id="Signup-email"
            placeholder="이메일을 입력해주세요"
            name="email"
            value={email}
            onChange={onChangeEmail}
            disabled={isEmailAuthed} // 이메일 인증 후 수정 불가능
          />
          <button
            className="Signup-auth-button"
            type="button"
            onClick={onClickEmailAuth}
            disabled={isEmailAuthed} // 이미 인증된 경우 버튼 비활성화
          >
            인증하기
          </button>
        </div>
        {emailError && (
          <div
            className={`error-message ${
              emailError === "올바르게 전송되었습니다. 메일을 확인해주세요."
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
            name="code"
            onChange={onChangeEmailAuth}
            disabled={isCodeAuthed} // 코드 인증 후 수정 불가능
          />
          <button
            className="Signup-auth-button"
            type="button"
            onClick={onClickCheckAuthCode}
            disabled={isCodeAuthed} // 이미 인증된 경우 버튼 비활성화
          >
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
            name="nickname"
            onChange={onChangeNickname}
          />
          <button
            className="Signup-auth-button"
            type="button"
            onClick={onClickNickname}
          >
            중복검사
          </button>
        </div>
        <div
          className={`error-message ${
            nicknameError === "사용 가능한 닉네임입니다."
              ? "is-valid"
              : "is-error"
          }`}
        >
          {nicknameError}
        </div>

        <div className="Signup-password-container">
          <label htmlFor="Signup-password">비밀번호</label>
          <input
            className="signup-input"
            type="password"
            id="Signup-password"
            placeholder="비밀번호를 입력해주세요"
            name="password"
            onChange={onChangePassword} // 비밀번호를 입력할 때마다 상태 업데이트
            onKeyUp={onKeyUpPassword}
          />
          <div className="input-null"></div>
        </div>
        <div
          className={`error-message ${
            passwordError === "사용 가능한 비밀번호입니다."
              ? "is-valid"
              : "is-error"
          }`}
        >
          {passwordError}
        </div>

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
        <div
          className={`error-message ${
            rePasswordError === "비밀번호가 일치합니다."
              ? "is-valid"
              : "is-error"
          }`}
        >
          {rePasswordError}
        </div>
        <button className="Signup-signup-button" type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
