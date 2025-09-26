import PropTypes from "prop-types";
import styles from "../TaskDetailsModal.module.css";

export default function TaskModalActions({ task, onSave, onClose, isSaving }) {
  return (
    <div className={styles.actionButtons}>
      <button
        type="button"
        className={styles.secondary}
        onClick={onClose}
        disabled={isSaving}
      >
        Скасувати
      </button>
      <button
        type="button"
        className={styles.primary}
        onClick={() => onSave(task)}
        disabled={isSaving}
      >
        Зберегти зміни
      </button>
    </div>
  );
}

TaskModalActions.propTypes = {
  task: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

TaskModalActions.defaultProps = {
  isSaving: false,
};
