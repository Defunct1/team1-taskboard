/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase/config";
import { useNavigate } from "react-router-dom";
import {
  Wrapper,
  Header,
  Email,
  LogoutButton,
  Nav,
  Content,
} from "./Dashboard.styles";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  return (
    <Wrapper>
      <Header>
        <Email>{userEmail}</Email>
        <div>
          <Nav>
            <a href="#">Головна</a>
            <a href="#">Мій акаунт</a>
            <a href="#">Підтримка</a>
          </Nav>
        </div>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <Content>
        <h2>Dashboard Content</h2>
        <p>Тут буде щось цікаве 👋</p>
      </Content>
    </Wrapper>
  );
}
