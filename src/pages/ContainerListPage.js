import React, { useState, useEffect, useRef } from "react";
import "../styles/ContainerListPage.css";
import "../styles/Sidebar.css";
import "../styles/ContainerList.css";
import "../styles/UserProfile.css";
import "../styles/ContainerModal.css";
import axios from "axios";

import Sidebar from "../components/ContainerList/Sidebar";
import ContainerList from "../components/ContainerList/ContainerList";
import ChatBubbleGlobal from "../components/ContainerList/ChatBubbleGlobal";

function ContainerListPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const token = localStorage.getItem("Authorization");

  // 유저 정보
  const [userNickname, setUserNickname] = useState(""); // 닉네임
  const [userProfileImgUrl, setUserProfileImgUrl] = useState(""); // 프로필 사진

  // 페이지 로드시 닉네임 정보 불러오기
  useEffect(() => {
    // API 요청 함수
    const userInfoApi = async () => {
      if (isFirstLoading.current) {
        setIsLoading(true); // 데이터 불러오기 시작
      }
      try {
        const response = await axios.get(`/api/user/profile`, {
          headers: { Authorization: token },
        });
        if (response.status === 200) {
          setUserNickname(response.data.nickname);
          setUserProfileImgUrl(response.data.profileImgUrl);
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
      } finally {
        if (isFirstLoading) {
          setIsLoading(false); // 데이터 불러오기 완료
          isFirstLoading.current = false;
        }
      }
    };
    userInfoApi();
  }, []);

  const LoadingModal = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
      <div className="loading-modal">
        <div className="loading-spinner"></div>
        <p className={"loading-p"}>데이터를 불러오는 중입니다...</p>
      </div>
    );
  };
  return (
    <div className="main-container">
      <LoadingModal isLoading={isLoading} />
      <Sidebar
        nickname={userNickname}
        profileimgurl={userProfileImgUrl}
      ></Sidebar>

      <ContainerList nickname={userNickname}></ContainerList>

      <ChatBubbleGlobal nickname={userNickname} />

      {/* <ContainerModal isOpen={isModalOpen} onClose={toggleModal} /> */}
    </div>
  );
}

export default ContainerListPage;
