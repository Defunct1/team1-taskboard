import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteColumn } from "../../../../store/boardSlice";
import Button from "../../../ui/button/Button";
import styles from "./DeleteColumnButton.module.css";

const DeleteColumnButton = ({ columnId, columnTitle }) => {
  const dispatch = useDispatch();
  const isAddingColumn = useSelector((state) => state.board.isAddingColumn);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteColumn = async () => {
    const confirmed = window.confirm(
      `Ви впевнені, що хочете видалити колонку "${columnTitle}"? 
      Ця дія видалить всі завдання в колонці і її неможливо буде скасувати.`
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      // ✅ ВИДАЛИТИ .unwrap()
      dispatch(deleteColumn(columnId));
      // Додайте невелику затримку для показу стану завантаження
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Помилка видалення колонки:", error);
      alert(`Помилка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleDeleteColumn}
      isLoading={isLoading || isAddingColumn}
      disabled={isLoading || isAddingColumn}
      className={styles.deleteBtn}
      title={`Видалити колонку "${columnTitle}" і всі її завдання`}
    >
      {isLoading || isAddingColumn ? "Видалення..." : "Видалити колонку"}
    </Button>
  );
};

export default DeleteColumnButton;