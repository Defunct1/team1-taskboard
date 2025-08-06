// src/pages/Auth.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 2rem;
  text-align: center;
`;

export const Title = styled.h2`
  margin-bottom: 1rem;
`;

export const ToggleButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  button {
    padding: 10px 20px;
    margin: 0 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    background-color: white;

    &:disabled {
      background-color: #f0f0f0;
      color: #888;
      cursor: default;
    }
  }
`;

export const VerifyMessage = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: #555;
`;
