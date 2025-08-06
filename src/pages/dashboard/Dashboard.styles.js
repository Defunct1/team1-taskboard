// src/pages/Dashboard.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

export const Email = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  a {
    text-decoration: none;
    color: #3498db;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

export const Content = styled.main`
  padding: 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;
