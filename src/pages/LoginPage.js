import React, { useEffect } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(localStorage.getItem("Authorization"));
  //   if (localStorage.getItem("Authorization")) {
  //     navigate(`/dashboard/containers`);
  //   } else {
  //     navigate(`/`);
  //   }
  // }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
