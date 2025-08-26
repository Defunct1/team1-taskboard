// src/ui/Portal.js
import { createPortal } from "react-dom";

export default function Portal({ children }) {
  const root = document.getElementById("modal-root");
  return createPortal(children, root);
}