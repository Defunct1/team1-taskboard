import PropTypes from "prop-types";
import styles from "./TaskDetailsModal.module.css";

export default function TaskMoveDropdown({ task, columns, onMove, isDisabled }) {
  const handleChange = (e) => {
    const newColumnId = e.target.value;
    if (newColumnId && onMove) {
      onMove(newColumnId); // ✅ Тут передається тільки newColumnId
    }
  };

  return (
    <select 
      value={task?.columnId ?? ""} 
      onChange={handleChange} 
      disabled={isDisabled}
      className={styles.moveSelect}
    >
      <option value="">-- Вибрати колонку --</option>
      {columns.map(c => (
        <option key={c.id} value={c.id}>
          {c.title}
        </option>
      ))}
    </select>
  );
}

TaskMoveDropdown.propTypes = {
  task: PropTypes.shape({
    columnId: PropTypes.string,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMove: PropTypes.func.isRequired, // ✅ Функція, яка приймає newColumnId
  isDisabled: PropTypes.bool,
};