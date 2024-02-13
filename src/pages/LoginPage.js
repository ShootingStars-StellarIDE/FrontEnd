import React, { useEffect } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
