import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../../apis/auth";
import selectpic from "../../assets/selectpic.svg";
import "../../styles/UserProfile.css"


function UserProfile() {
  const navigate = useNavigate();

  //----------------------------------------------------------------state
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState(" ");

  const [currentPasswordError, setcurrentPasswordError] = useState(" ");

  const [newPasswordError, setnewPasswordError] = useState(
    "(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요(허용 특수문자:@$!%*#?&)"
  );

  const [renewPasswordError, setRenewPasswordError] = useState(" ");

  //회원가입 요청
  // const join = async (form) => {
  //   let response;

  //   // response = await auth.signup(form.email, form.nickname, form.password);
  //   response = await auth.ChangePassword(currentPassword, newPassword);

  //   const status = response.status;

  //   try {
  //     if (status === 200) {
  //       navigate("/");
  //     }
  //   } catch (error) {

  //     // 잘못된 형식의 비밀번호입니다.
  //     if (error.response.data.code === 1004) {
  //       console.error(error.response.data.description);
  //     }
  //     // 잘못된 패스워드입니다.
  //     else if (error.response.data.code === 1104) {
  //       console.error(error.response.data.description);
  //     }
  //     // 현재 사용중인 패스워드입니다. 다른 패스워드로 입력바랍니다.
  //     else if (error.response.data.code === 1304) {
  //       console.error(error.response.data.description);
  //     }
  //   }
  // };

  //----------------------------------------------------------------비밀번호 관련
  const onChangePassword = (event) => {
    const input = event.target.value;
    setcurrentPassword(input); // 비밀번호 상태를 업데이트
    if (input === "") {
      setcurrentPasswordError("비밀번호를 작성해주세요."); // 입력 필드가 비었을 때의 에러 메시지를 업데이트
    } else {
      setcurrentPasswordError(" "); // 입력이 시작되면 에러 메시지를 초기화
    }
  };

  const onChangenewPassword = (event) => {
    const input = event.target.value;

    const passwordAuthCheck =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordAuthCheck.test(input)) {
      setnewPasswordError("비밀번호가 조건에 맞지 않습니다.");
    }

    setnewPassword(input);
    if (input === "") {
      setnewPasswordError("비밀번호를 작성해주세요."); // 입력 필드가 비었을 때의 에러 메시지를 업데이트
    } else if (input === currentPassword) {
      setnewPasswordError("현재 사용중인 패스워드입니다.");
    } else if( input !== currentPassword) {
      setnewPasswordError("사용 가능한 비밀번호입니다."); // 입력이 시작되면 에러 메시지를 초기화
    }
  };

  const onKeyUpPassword = (event) => {
    event.preventDefault();
    // 엔터 키가 눌렸는지 확인
    if (event.key === "Enter") {
      // 입력된 비밀번호가 없으면 기본 안내문을 다시 설정
      if (!event.target.value) {
        setnewPasswordError("(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요");
      } else {
        PasswordAuthCheck(event.target.value);
      }
    }
  };

  function PasswordAuthCheck(inputPassword) {
    const passwordAuthCheck =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordAuthCheck.test(inputPassword)) {
      setnewPasswordError("비밀번호가 조건에 맞지 않습니다.");
    } else {
      setnewPasswordError("사용 가능한 비밀번호입니다.");
    }
  }

  //----------------------------------------------------------------비밀번호 재확인 관련

  const onChangeRePassword = (event) => {
    setRenewPassword(event.target.value);
  };

  const checkRePassword = () => {
    if (renewPassword === "") {
      setRenewPasswordError("");
    } else if (newPassword !== renewPassword) {
      setRenewPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setRenewPasswordError("비밀번호가 일치합니다.");
    }
  };

  //--------------------------------------------------------
  //회원가입 제출

  // const onJoin = async (e) => {
  //   e.preventDefault(); // submit 기본 동작 방지
  //   const form = e.target;
  //   const password = form.password.value;

  //   let isValid = true;

  //   // 비밀번호 검사

  //   if (newPasswordError !== "사용 가능한 비밀번호입니다.") {
  //     setnewPasswordError("작성을 완료해주세요.");
  //     isValid = false;
  //   }

  //   // 비밀번호 확인 검사

  //   if (renewPasswordError !== "비밀번호가 일치합니다.") {
  //     setRenewPasswordError("작성을 완료해주세요.");
  //     isValid = false;
  //   }

  //   // 모든 유효성 검사를 통과하지 못한 경우 함수 종료
  //   if (!isValid) {
  //     return;
  //   } else {
  //     console.log(password);
  //     join({ password });
  //   }
  // };


  const onLogin = (e) => {
    e.preventDefault();

    let isValid = true;
    const passwordAuthCheck =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    // 비밀번호가 비어있는지 확인
    if (!newPassword) {
      setcurrentPasswordError("비밀번호를 작성해주세요.");
      isValid = false;
    } else if (!passwordAuthCheck.test(newPassword)) {
      // 비밀번호 형식을 검사합니다.
      setnewPasswordError("비밀번호 형식이 올바르지 않습니다.");
      isValid = false;
    } else {
      setnewPasswordError(""); // 에러 메시지를 지웁니다.
    }

    // 이메일과 비밀번호가 모두 유효한 경우 로그인 로직을 수행
    // if (isValid) {
    //   let userCredentials = { newPassword };
    //   dispatch(loginUser(userCredentials)).then((result) => {
    //     if (result.payload) {
    //       if (localStorage.getItem("Authorization")) {
    //         navigate(`/dashboard/containers`);
    //       } else {
    //         navigate(`/`);
    //       }
    //     }
    //   });
    // }
  };

  return (
    <div className="contents">
      <div className="contents-header">
        <div className="user-profile-display">
          <p>별똥별</p>
          <p>님 / 프로필</p>
        </div>
      </div>

      <form
        className="Signup-Form"
        // onSubmit={(e) => onJoin(e)}
        onKeyDown={(e) => {
          // 엔터 키를 눌렀을 때의 동작
          if (e.key === "Enter") {
            e.preventDefault(); // 폼의 자동 제출 방지
            // 필요한 경우, 여기서 추가적인 로직을 실행할 수 있다
          }
        }}
      > 
        <div className="profile-card">
          <div className="profile-image-placeholder">
            <div className="notification-badge">
              <img src={selectpic} />
            </div>
          </div>

          <div className="profile-info">
            <p className="title">닉네임</p>
            <p className="info">별똥별</p>
            <p className="title">계정</p>
            <p className="info">Shootingstar@groom.co.kr</p>
            <p className="title">비밀번호 수정</p>

            <input
              className="password-input"
              type="password"
              id="Login-password"
              placeholder="기존 비밀번호"
              value={currentPassword}
              onChange={onChangePassword}
            />
            <div className="input-null"></div>

            {currentPasswordError && (
              <div className="error-message is-error">{currentPasswordError}</div>
            )}

            <div className="spacebox"></div>

            <input
              className="new-password-input"
              type="password"
              id="Signup-password"
              placeholder="새 비밀번호"
              name="password"
              onChange={onChangenewPassword} // 비밀번호를 입력할 때마다 상태 업데이트
              onKeyUp={onKeyUpPassword}
            />
            {/* <div className="input-null"></div> */}

            <div
              className={`error-message ${
                newPasswordError === "사용 가능한 비밀번호입니다."
                ? "is-valid" : "is-error"
              }`}
            >
              {newPasswordError}
            </div>

            <input
              className="new-password-input"
              type="password"
              id="Signup-re-password"
              placeholder="새 비밀번호 확인"
              onChange={onChangeRePassword}
              onKeyUp={checkRePassword}
            />
            <div className="input-null"></div>

            <div
              className={`error-message ${renewPasswordError === "비밀번호가 일치합니다."
                ? "is-valid" : "is-error"
                }`}
            >
              {renewPasswordError}
            </div>

            <p className="title">내 컨테이너 개수</p>
            <p className="info">3개</p>
            <p className="title">공유 컨테이너 개수</p>
            <p className="info">7개</p>
            <button className="edit-button" type="submit">회원정보 수정</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;