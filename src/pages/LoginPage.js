import React, { useEffect } from "react";
import "../styles/Login.css";

import LoginForm from "../components/Login/LoginForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 'Authorization' 토큰을 가져옵니다.
    const authToken = localStorage.getItem("Authorization");

    // 'Authorization' 토큰이 존재한다면, 대시보드 페이지로 리디렉션합니다.
    if (authToken) {
      navigate("/dashboard/containers");
    }
  }, [navigate]);
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
