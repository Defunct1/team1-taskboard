import React, { useState } from "react";
import PropTypes from "prop-types";
import { useBoardActions } from "../../../../pages/dashboard/boardhooks/useBoardActions";
import Button from "../../../ui/button/Button";
import styles from "./DeleteColumnButton.module.css";

const DeleteColumnButton = ({ columnId, columnTitle }) => {
  const { deleteColumn, isAddingColumn } = useBoardActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteColumn = async () => {
    const confirmed = window.confirm(
      `Ви впевнені, що хочете видалити колонку "${columnTitle}"? Ця дія видалить всі завдання в колонці і її неможливо буде скасувати.`
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      await deleteColumn(columnId);
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

DeleteColumnButton.propTypes = {
  columnId: PropTypes.string.isRequired,
  columnTitle: PropTypes.string.isRequired,
};

export default DeleteColumnButton;