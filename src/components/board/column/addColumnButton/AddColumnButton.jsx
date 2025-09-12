import { useState } from "react";
import { useBoardActions } from "../../../../pages/dashboard/boardhooks/useBoardActions";
import Button from "../../../ui/button/Button";
import styles from "../../../../pages/dashboard/BoardPage.module.css";


const AddColumnButton = ({ currentColumnsCount = 0 }) => {
  const { addColumn, isAddingColumn } = useBoardActions();
  const [isAdding, setIsAdding] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const handleAddColumn = async () => {
    if (!columnTitle.trim()) {
      alert("Будь ласка, введіть назву колонки");
      return;
    }

    try {
      await addColumn(columnTitle);
      setColumnTitle("");
      setIsAdding(false);
    } catch (error) {
      console.error("Помилка додавання колонки:", error);
      alert(`Помилка: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setColumnTitle("");
    setIsAdding(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddColumn();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={styles.wrapper}>
      {isAdding ? (
        <div className={styles.form}>
          <input
            type="text"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Введіть назву колонки..."
            className={styles.input}
            autoFocus
            maxLength={50}
            disabled={isAddingColumn}
          />
          <div className={styles.charCounter}>
            {columnTitle.length}/50 символів
          </div>
          <div className={styles.buttons}>
            <Button
              onClick={handleAddColumn}
              disabled={isAddingColumn || !columnTitle.trim()}
              isLoading={isAddingColumn}
              variant="primary"
            >
              {isAddingColumn ? "Додавання..." : "Додати колонку"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              disabled={isAddingColumn}
            >
              Скасувати
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="ghost"
          icon="plus"
          className={styles.addButton}
          disabled={isAddingColumn}
        >
          Додати колонку
        </Button>
      )}
    </div>
  );
};

export default AddColumnButton;