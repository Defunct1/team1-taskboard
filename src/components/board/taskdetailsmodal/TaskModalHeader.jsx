// TaskModalHeader.jsx
import PropTypes from "prop-types";
import styles from "./TaskDetailsModal.module.css";

export default function TaskModalHeader({ task, onClose }) {
  return (
    <div className={styles.header}>
      <h2>{task?.text || "Нова картка"}</h2>
      <button className={styles.closeButton} onClick={onClose} aria-label="Закрити">×</button>
    </div>
  );
}

TaskModalHeader.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
