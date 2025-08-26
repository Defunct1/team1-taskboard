import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function DropdownPortal({ children, isOpen, onClose, anchorRef }) {
  const elRef = useRef(document.createElement("div"));

  useEffect(() => {
    const el = elRef.current;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, anchorRef, onClose]);

  if (!isOpen) return null;

  const rect = anchorRef.current.getBoundingClientRect();
  const style = {
    position: "absolute",
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    minWidth: rect.width,
    zIndex: 3000,
  };

  return createPortal(<div style={style}>{children}</div>, elRef.current);
}
