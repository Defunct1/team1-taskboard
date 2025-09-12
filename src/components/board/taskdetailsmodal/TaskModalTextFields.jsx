// TaskModalTextFields.jsx
import PropTypes from "prop-types";
import styles from "./TaskDetailsModal.module.css";

export default function TaskModalTextFields({ task, setTask }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Опис</h3>
      <textarea
        className={styles.descriptionInput}
        value={task?.description ?? ""}
        placeholder="Додати детальніший опис..."
        onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
        rows={4}
      />
    </div>
  );
}

TaskModalTextFields.propTypes = {
  task: PropTypes.object.isRequired,
  setTask: PropTypes.func.isRequired,
};
