// components/EditOverlay.js
import Button from "../../../ui/button/Button";
import styles from "./EditOverlay.module.css";

export const EditOverlay = ({ pendingChanges, onSave, onCancel, isSaving }) => {
  if (!pendingChanges || pendingChanges.length === 0) return null;

  return (
    <div className={styles.editOverlay}>
      <div className={styles.editControls}>
        <Button 
          onClick={onSave} 
          variant="primary" 
          disabled={isSaving || pendingChanges.length === 0}
          isLoading={isSaving}
        >
          💾 Зберегти зміни ({pendingChanges.length})
        </Button>
        <Button 
          onClick={onCancel} 
          variant="secondary" 
          disabled={isSaving}
        >
          ❌ Скасувати
        </Button>
      </div>
    </div>
  );
};
