import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import "../styles/UserProfile.css";
import "../styles/ContainerListPage.css";
import Sidebar from "../components/ContainerList/Sidebar";
import UserProfile from "../components/UserProfile/UserProfile";
import axios from "axios";

function ProfilePage() {
  const token = localStorage.getItem("Authorization");
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userProfileImgUrl, setUserProfileImgUrl] = useState("");
  const [userOwnedContainers, setUserOwnedContainers] = useState("");
  const [userSharedContainers, setUserSharedContainers] = useState("");

  useEffect(() => {
    // API 요청 함수
    const userInfoApi = async () => {
      try {
        let response = await axios.get(`/api/user/profile`, {
          headers: { Authorization: token },
        });
        if (response.status === 200) {
          setUserEmail(response.data.email);
          setUserNickname(response.data.nickname);
          setUserProfileImgUrl(response.data.profileImgUrl);
          setUserOwnedContainers(response.data.ownedContainers);
          setUserSharedContainers(response.data.sharedContainers);
        }
      } catch (error) {
        if (error.response.data.code === "0100") {
          // 인증에 실패하였습니다.
          console.error(error.response.data.description);
        } else if (error.response.data.code === "0101") {
          // 잘못된 접근입니다.
          console.error(error.response.data.description);
        } else if (error.response.data.code === "0102") {
          // 잘못된 Access Token 입니다.
          console.error(error.response.data.description);
        } else if (error.response.data.code === "0103") {
          // 만료된 Access Token 입니다.(해당 에러 발생시 Refresh 요청)
          console.error(error.response.data.description);
        } else if (error.response.data.code === "0104") {
          // 지원하지 않는 Access Token 입니다.
          console.error(error.response.data.description);
        } else if (error.response.data.code === "0105") {
          // Claim이 빈 Access Token 입니다.
          console.error(error.response.data.description);
        } else if (error.response.data.code === "1203") {
          // 존재하지 않는 사용자입니다.
          console.error(error.response.data.description);
        }
      }
    };
    userInfoApi(); // 컴포넌트가 마운트될 때 API 요청 실행
  }, []);

  return (
    <div className="main-container">
      <Sidebar
        nickname={userNickname}
        profileimgurl={userProfileImgUrl}
      ></Sidebar>

      <UserProfile
        email={userEmail}
        nickname={userNickname}
        profileimgurl={userProfileImgUrl}
        ownedcontainers={userOwnedContainers}
        sharedcontainers={userSharedContainers}
      ></UserProfile>
    </div>
  );
}

export default ProfilePage;
