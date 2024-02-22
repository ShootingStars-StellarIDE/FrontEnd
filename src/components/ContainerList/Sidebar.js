import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../../apis/auth";
import Loading from "../Loading";

function Sidebar({ nickname, profileimgurl }) {
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);

  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/dashboard/profile`);
  };

  const goToContainerList = () => {
    navigate(`/dashboard/containers`);
  };

  const DmUserClick = () => {
    alert("dm창 띄우기");
  };

  const dmusers = ["IU", "Jungkook", "Eunha", "Eunji"];

  //----------------------------------------------------------------logout
  const logout = async () => {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    try {
      const res = await auth.logout();
      console.log(res);
      if (res.status === 200) {
        localStorage.removeItem("Authorization");
        alert("다음에 또 봐요 우리👋");
        navigate("/");
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
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }

    if (isLoading) {
      return <Loading />;
    }
    //--------------------------------------------------------
  };
  return (
    <div className="sidebar">
      {/* 프로필 카드 */}
      <div className="profilecard">
        <div className="picdisplay">
          <div className="pic" onClick={goToProfile}>
            <img
              src={
                profileimgurl === null
                  ? "https://img.sbs.co.kr/newsnet/etv/upload/2022/09/19/30000790950.jpg"
                  : profileimgurl
              }
              alt="UserIcon"
            />
          </div>
          <div className="welcomement">
            <p className="userNickname">{nickname} 님</p>
            <p>환영합니다!</p>
          </div>
        </div>
      </div>

      {/* 컨테이너 스페이스 */}
      <div className="conspace">
        <details open>
          <summary>Containers</summary>
          <div onClick={goToContainerList}>모든 컨테이너</div>
          <div>내 컨테이너</div>
          <div>공유 컨테이너</div>
        </details>
      </div>

      {/* 다이렉트 메시지 */}
      <div className="dmlist">
        <details open>
          <summary>DM</summary>
          {dmusers.map((dmuser, dmlistkey) => (
            <div key={dmlistkey} onClick={DmUserClick}>
              <img
                src="https://exp.goorm.io/_next/image?url=https%3A%2F%2Fexp-upload.goorm.io%2F2023-11-13%2FN%2FN20D3vbX1qrGSyOcnU.webp&w=96&q=75"
                alt="DmIcon"
              />
              <p>{dmuser}</p>
            </div>
          ))}
        </details>
      </div>
      <div className="logout-div">
        <p className="logout" onClick={logout}>
          로그아웃 하기
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
