// src/pages/Auth.jsx
import React, { useState } from "react";
import LoginForm from "../../components/auth/login-form/LoginForm";
import RegisterForm from "../../components/auth/register-form/RegisterForm";
import { Wrapper, Title, ToggleButtons, VerifyMessage } from "./Auth.styles";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [emailCheckMessage] = useState("");

  return (
    <Wrapper>
      <Title>{isLogin ? "Login" : "Register"}</Title>

      <ToggleButtons>
        <button onClick={() => setIsLogin(true)} disabled={isLogin}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} disabled={!isLogin}>
          Register
        </button>
      </ToggleButtons>

      {isLogin ? <LoginForm /> : <RegisterForm />}

      <VerifyMessage>{emailCheckMessage}</VerifyMessage>
    </Wrapper>
  );
}
