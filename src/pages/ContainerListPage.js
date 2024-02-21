import React, { useState, useEffect } from "react";
import "../styles/ContainerListPage.css";
import "../styles/Sidebar.css";
import "../styles/ContainerList.css";
import "../styles/UserProfile.css";
import * as auth from "../apis/auth";

import ContainerModal from "../components/ContainerList/ContainerModal";
import "../styles/ContainerModal.css";

import Sidebar from "../components/ContainerList/Sidebar";
import ContainerList from "../components/ContainerList/ContainerList";
import ChatBubbleGlobal from "../components/ContainerList/ChatBubbleGlobal";

function ContainerListPage() {

  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // 유저 정보
  const [userNickname, setUserNickname] = useState(""); // 닉네임
  const [userProfileImgUrl, setUserProfileImgUrl] = useState(""); // 프로필 사진

  // 페이지 로드시 닉네임 정보 불러오기
  useEffect(() => {
    // API 요청 함수
    const userInfoApi = async () => {
      try {
        let response = await auth.profile();
        console.log(response.data);
        if (response.status == 200) {
          setUserNickname(response.data.nickname);
          setUserProfileImgUrl(response.data.profileImgUrl);
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
    <div className="main-container">
      <Sidebar 
        nickname={userNickname}
        profileimgurl = {userProfileImgUrl}
      ></Sidebar>

      <ContainerList nickname={userNickname}></ContainerList>

      <ChatBubbleGlobal nickName="태균이" />

      {/* <ContainerModal isOpen={isModalOpen} onClose={toggleModal} /> */}
    </div>
  );
}

export default ContainerListPage;
