// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../utils/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Message } from "./LoginForm.styles";
import ButtonLoginWithGoogle from "./../../ui/button/ButtonLoginWithGoogle";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (!userCred.user.emailVerified) {
        setMsg("Будь ласка, підтвердіть email перед входом.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMsg(error.message);
    }
  };

  const handleLoginWithGoogle = async (e) => {
    setMsg("");

    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      if (!userCred.user.emailVerified) {
        setMsg("Будь ласка, підтвердіть email перед входом.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMsg(error.message);
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">Login</Button>

      <ButtonLoginWithGoogle type="button" onClick={handleLoginWithGoogle}>Login with Google</ButtonLoginWithGoogle>
      {msg && <Message>{msg}</Message>}
    </Form>
  );
}
