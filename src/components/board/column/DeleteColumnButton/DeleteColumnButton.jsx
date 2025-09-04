import React, { useState } from "react";
import PropTypes from "prop-types";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../utils/firebase/firebase"; 
import Button from "../../../ui/button/Button"; 
import styles from "./DeleteColumnButton.module.css";

const DeleteColumnButton = ({ columnId, onDeleted }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteColumn = async () => {
    const confirmed = window.confirm("Ви впевнені, що хочете видалити колонку?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "columns", columnId));
      if (onDeleted) onDeleted(columnId);
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
      isLoading={isLoading}
      className={styles.deleteBtn}
    >
      Видалити колонку
    </Button>
  );
};

DeleteColumnButton.propTypes = {
  columnId: PropTypes.string.isRequired,
  onDeleted: PropTypes.func,
};

export default DeleteColumnButton;


// ToDo: