// src/pages/admin/AdminPanel.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
  }

  select {
    padding: 6px;
    border-radius: 4px;
  }

  button {
    padding: 6px 12px;
    background-color: #e74c3c;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #c0392b;
    }
  }
`;
