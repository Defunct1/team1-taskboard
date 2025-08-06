// src/components/auth/RegisterForm.styles.js
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
  background-color: #e67e22;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #d35400;
  }
`;

export const Message = styled.p`
  color: green;
  text-align: center;
`;
