import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../../apis/auth";
import selectpic from "../../assets/selectpic.svg";
import ProfileImgModal from "./ProfileImgModal";
import "../../styles/UserProfile.css";
import UserDeleteModal from "./UserDeleteModal";
import Loading from "../Loading";
import axios from "axios";

function UserProfile({
  email,
  nickname,
  profileimgurl,
  ownedcontainers,
  sharedcontainers,
}) {
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
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
  const token = localStorage.getItem("Authorization");

  // 모달
  const [isOpen, setIsOpen] = useState(false);
  const [isImgOpen, setIsImgOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openImgModal = () => setIsImgOpen(true);
  const closeImgModal = () => setIsImgOpen(false);

  const [isOpen2, setIsOpen2] = useState(false);
  const openModal2 = () => setIsOpen2(true);
  const closeModal2 = () => setIsOpen2(false);

  //----------------------------------------------------------------비밀번호 관련
  const onChangePassword = (event) => {
    setcurrentPassword(event.target.value);
  };

  const onKeyUpcurrentPassword = () => {
    if (currentPassword === "") {
      setcurrentPasswordError(
        "(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요"
      );
    } else {
      PasswordAuthCheck2(currentPassword);
    }
  };

  function PasswordAuthCheck2(inputPassword) {
    const passwordAuthCheck2 =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordAuthCheck2.test(inputPassword)) {
      setcurrentPasswordError("비밀번호가 조건에 맞지 않습니다.");
    } else {
      setcurrentPasswordError("비밀번호가 조건에 맞습니다.");
    }
  }

  //----------------------------------------------------------------새 비밀번호 관련
  const onChangeNewPassword = (event) => {
    setnewPassword(event.target.value);
  };

  const onKeyUpPassword = () => {
    if (newPassword === "") {
      setnewPasswordError("(영어,특수문자,숫자)를 포함한 8~16자를 입력하세요");
    } else {
      PasswordAuthCheck(newPassword);
    }
  };

  function PasswordAuthCheck(inputPassword) {
    const passwordAuthCheck =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordAuthCheck.test(inputPassword)) {
      setnewPasswordError("비밀번호가 조건에 맞지 않습니다.");
    } else if (inputPassword === currentPassword) {
      setnewPasswordError("이미 사용중인 비밀번호입니다.");
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

  //----------------------------------------------------------------회원정보 수정 요청 유효성 검사

  const editInfo = async (e) => {
    e.preventDefault();
    const form = e.target;
    const currentPassword = form.password.value;
    const newPassword = form.newpassword.value;

    let isValid = true;

    if (currentPasswordError !== "비밀번호가 조건에 맞습니다.") {
      setcurrentPasswordError("비밀번호를 확인해 주세요.");
      isValid = false;
    }

    if (newPasswordError !== "사용 가능한 비밀번호입니다.") {
      setnewPasswordError("비밀번호를 확인해 주세요.");
      isValid = false;
    }

    if (renewPasswordError !== "비밀번호가 일치합니다.") {
      setRenewPasswordError("비밀번호를 확인해 주세요.");
      isValid = false;
    }

    if (!isValid) {
      return;
    } else {
      editInfoApi({ password: currentPassword, newpassword: newPassword });
    }
  };

  //----------------------------------------------------------------회원정보 수정 요청
  const editInfoApi = async (form) => {
    {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    const password = form.password;
    const newPassword = form.newpassword;

    // 비밀번호 확인
    try {
      let response = await axios.post(
        `./api/auth/checkPassword`,
        { password },
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        // 비밀번호 확인이 완료됐다면

        try {
          const editInfoRequest = await axios.patch(
            `/api/auth/changePassword`,
            { password, newPassword },
            { headers: { Authorization: token } }
          );
          // 비밀번호 변경
          if (editInfoRequest.status === 200) {
            // 비밀번호 변경이 완료됐다면
            alert("회원정보가 변경되었습니다.");
            localStorage.removeItem("Authorization"); // access token 삭제(로그아웃)
            navigate("/");
          }
        } catch (error) {
          if (error.response.data.code === "1004") {
            // 잘못된 형식의 비밀번호입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0100") {
            // 인증에 실패하였습니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0101") {
            // 잘못된 접근입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0102") {
            // 잘못된 Access Token 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0103") {
            // 만료된 Access Token 입니다.(해당 에러 발생시 Refresh 요청)
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0104") {
            // 지원하지 않는 Access Token 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0105") {
            // Claim이 빈 Access Token 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0106") {
            // 잘못된 Refresh Token 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0107") {
            // 만료된 Refresh Token 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0108") {
            // 지원하지 않는 Refresh Token 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "0109") {
            // Claim이 빈 RefreshToken 입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "1201") {
            // 존재하지 않는 사용자입니다.
            alert(error.response.data.description);
            console.error(error.response.data.description);
          } else if (error.response.data.code === "1104") {
            // 잘못된 패스워드입니다.
            console.error(error.response.data.description);
          } else if (error.response.data.code === "1304") {
            // 현재 사용중인 패스워드입니다. 다른 패스워드로 입력바랍니다.
            console.error(error.response.data.description);
          }
        }
      }
    } catch (error) {
      console.log("흠");
      if (error.response.data.code === "1004") {
        // 잘못된 형식의 비밀번호입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0100") {
        // 인증에 실패하였습니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0101") {
        // 잘못된 접근입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0102") {
        // 잘못된 Access Token 입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0103") {
        // 만료된 Access Token 입니다.(해당 에러 발생시 Refresh 요청)
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0104") {
        // 지원하지 않는 Access Token 입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0105") {
        // Claim이 빈 Access Token 입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "1201") {
        // 존재하지 않는 사용자입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      } else if (error.response.data.code === "1104") {
        // 잘못된 패스워드입니다.
        setcurrentPasswordError(error.response.data.description);
        console.error(error.response.data.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  };

  const UserDelete = () => {
    openModal2(); // 모달 열기
  };

  const [isFormValid, setIsFormValid] = useState(false);

  // 상태가 변경될 때마다 폼의 유효성을 재평가
  useEffect(() => {
    const isValid =
      currentPasswordError === "비밀번호가 조건에 맞습니다." &&
      newPasswordError === "사용 가능한 비밀번호입니다." &&
      renewPasswordError === "비밀번호가 일치합니다.";
    setIsFormValid(isValid);
  }, [currentPasswordError, newPasswordError, renewPasswordError]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="contents">
      <ProfileImgModal
        isOpen={isImgOpen}
        close={closeImgModal}
        profileimgurl={profileimgurl}
      />

      <div className="contents-header">
        <div className="user-profile-display">
          <p className="userNickname">{nickname}</p>
          <p>님 / 프로필</p>
        </div>
      </div>

      <form
        className="Signup-Form"
        onSubmit={(e) => editInfo(e)}
        // 엔터 키를 눌렀을 때 폼의 자동 제출 방지
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="profile-card">
          <div className="profile-image-placeholder">
            {/* 프로필 사진 */}
            {profileimgurl && (
              <img
                src={
                  profileimgurl === null
                    ? "https://img.sbs.co.kr/newsnet/etv/upload/2022/09/19/30000790950.jpg"
                    : profileimgurl + "?cache=" + Math.random()
                }
                alt="userimg"
                className="userimg"
              />
            )}
            {/* 사진 변경 뱃지 */}
            <div className="notification-badge">
              <img
                src={selectpic}
                alt="selectpic"
                className="pic-edit-badge"
                onClick={openImgModal}
              />
            </div>
          </div>

          <div className="profile-info">
            <p className="title">닉네임</p>
            <p className="info">{nickname}</p>
            <p className="title">계정</p>
            <p className="info">{email}</p>
            <p className="title">비밀번호 수정</p>

            <input
              className="password-input"
              type="password"
              id="Login-password"
              placeholder="기존 비밀번호"
              name="password"
              value={currentPassword}
              onChange={onChangePassword}
              onKeyUp={onKeyUpcurrentPassword}
            />
            <div className="input-null"></div>

            <div
              className={`error-message ${
                currentPasswordError === "비밀번호가 조건에 맞습니다."
                  ? "is-valid"
                  : "is-error"
              }`}
            >
              {currentPasswordError}
            </div>

            <div className="spacebox"></div>

            <input
              className="new-password-input"
              type="password"
              id="Signup-password"
              placeholder="새 비밀번호"
              name="newpassword"
              onChange={onChangeNewPassword} // 비밀번호를 입력할 때마다 상태 업데이트
              onKeyUp={onKeyUpPassword}
            />

            <div
              className={`error-message ${
                newPasswordError === "사용 가능한 비밀번호입니다."
                  ? "is-valid"
                  : "is-error"
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
              className={`error-message ${
                renewPasswordError === "비밀번호가 일치합니다."
                  ? "is-valid"
                  : "is-error"
              }`}
            >
              {renewPasswordError}
            </div>

            <p className="title">내 컨테이너 개수</p>
            <p className="info">{ownedcontainers}개</p>
            <p className="title">공유 컨테이너 개수</p>
            <p className="info">{sharedcontainers}개</p>
            <button
              className={`edit-button ${isFormValid ? "" : "disabled"}`}
              type="submit"
            >
              회원정보 수정
            </button>
            <div className="cancel-membership-container">
              <div>회원 탈퇴를 하시겠습니까?</div>
              <div className="cancel-membership" onClick={UserDelete}>
                회원 탈퇴
              </div>
            </div>
          </div>
        </div>
      </form>
      <UserDeleteModal isOpen={isOpen2} close={closeModal2} />
    </div>
  );
}

export default UserProfile;
