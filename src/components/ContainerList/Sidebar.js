import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../../apis/auth";

function Sidebar() {

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

  const dmusers = ['IU', 'Jungkook', 'Eunha', 'Eunji'];

  // 유저 정보
  const [userNickname, setUserNickname] = useState("");

  // 페이지 로드시 닉네임 정보 불러오기
  useEffect(() => {
    // API 요청 함수
    const userInfoApi = async () => {
      try {
        let response = await auth.profile();
        // console.log(response);
        if (response.status == 200) {
          setUserNickname(response.data.nickname);
          // setUserOwnedContainers(response.data.ownedContainers);
          // setUserSharedContainers(response.data.sharedContainers);
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.code === 100) {
          // 인증에 실패하였습니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 101) {
          // 잘못된 접근입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 102) {
          // 잘못된 Access Token 입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 103) {
          // 만료된 Access Token 입니다.(해당 에러 발생시 Refresh 요청)
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 104) {
          // 지원하지 않는 Access Token 입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 105) {
          // Claim이 빈 Access Token 입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 1203) {
          // 존재하지 않는 사용자입니다.
          console.error(error.response.data.description);
        }
      }
    };
    userInfoApi();
  }, []);

  return (
    <div className="sidebar">
      {/* 프로필 카드 */}
      <div className="profilecard">
        <div className="picdisplay">
          <div className="pic"
            onClick={goToProfile}
          >
            <img src="https://exp.goorm.io/_next/image?url=https%3A%2F%2Fexp-upload.goorm.io%2F2023-11-13%2FN%2FN20D3vbX1qrGSyOcnU.webp&w=96&q=75" alt="UserIcon" />
          </div>
          <div className="welcomement">
            <p className="userNickname">{userNickname} 님</p>
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
              <img src="https://exp.goorm.io/_next/image?url=https%3A%2F%2Fexp-upload.goorm.io%2F2023-11-13%2FN%2FN20D3vbX1qrGSyOcnU.webp&w=96&q=75" alt="DmIcon" />
              <p>{dmuser}</p>
            </div>
          ))}
        </details>
      </div>
    </div>

  );
}

export default Sidebar;