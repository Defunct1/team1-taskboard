// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../utils/firebase/config";
import { Form, Input, Button, Message } from "./RegisterForm.styles";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCred.user);

      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role: "user",
        createdAt: new Date(),
      });

      setMsg("Реєстрація успішна! Перевірте пошту для підтвердження.");
    } catch (error) {
      console.error(error);
      setMsg(error.message);
    }
  };

  return (
    <Form onSubmit={handleRegister}>
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

      <Button type="submit">Register</Button>
      {msg && <Message>{msg}</Message>}
    </Form>
  );
}
