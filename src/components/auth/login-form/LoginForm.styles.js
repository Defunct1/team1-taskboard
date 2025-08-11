// src/components/auth/LoginForm.styles.js
import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 10px;
  margin: 0 auto;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #2ecc71;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #27ae60;
  }
`;

export const Message = styled.p`
  color: red;
  text-align: center;
`;
