import React from "react";
import styles from "./EditOverlay.module.css";
import Button from "../../../ui/button/Button";

export const EditOverlay = ({ pendingChanges, onSave, onCancel, isSaving }) => {
  if (!pendingChanges || pendingChanges.length === 0) return null;

  // ✅ Фільтруємо неправильні зміни
  const validChanges = pendingChanges.filter(change => {
    if (change.type === 'MOVE_TASK') {
      // Перевіряємо, чи всі необхідні параметри є
      return change.taskId && change.fromColumnId && change.toColumnId;
    }
    return true; // Інші типи змін залишаємо
  });

  // ✅ Якщо немає валідних змін - не показуємо оверлей
  if (validChanges.length === 0) return null;

  return (
    <div className={styles.editOverlay}>
      <div className={styles.editControls}>
        <Button
          onClick={onSave}
          disabled={isSaving}
          isLoading={isSaving}
          variant="primary"
          size="md"
          className={styles.editButtonPrimary}
        >
          💾 Зберегти зміни ({validChanges.length})
        </Button>

        <Button
          onClick={onCancel}
          disabled={isSaving}
          variant="secondary"
          size="md"
          className={styles.editButtonSecondary}
        >
          ❌ Скасувати
        </Button>
      </div>
    </div>
  );
};