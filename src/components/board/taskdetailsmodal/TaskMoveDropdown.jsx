import PropTypes from "prop-types";
import styles from "./TaskDetailsModal.module.css";

export default function TaskMoveDropdown({ task, columns, onMove, isDisabled }) {
  const handleChange = (e) => {
    const newColumnId = e.target.value;
    console.log("🔍 TaskMoveDropdown - handleChange:", {
    newColumnId,
    taskId: task?.id,
    currentColumnId: task?.columnId,
    hasOnMove: !!onMove
  });

  if (!newColumnId || !onMove || !task?.id || !task?.columnId) {
    console.error("❌ Missing data for move");
    return;
  }
    
    

    // Перевіряємо, чи все необхідне є
    if (!newColumnId || !onMove || !task || !task.id || !task.columnId) {
      console.error("Missing data for move:", { 
        newColumnId, 
        onMove, 
        taskId: task?.id, 
        currentColumnId: task?.columnId 
      });
      return;
    }

    // Перевіряємо, чи це не той самий стовпець
    if (String(newColumnId) === String(task.columnId)) {
      console.log("Same column, no move needed");
      return;
    }

    // Визначаємо новий індекс — кінець списку в колонці призначення
    const destinationColumn = columns.find(c => String(c.id) === String(newColumnId));
    const newIndex = (destinationColumn?.tasks?.length) ?? 0;

    console.log("Moving task:", {
      taskId: task.id,
      fromColumnId: task.columnId,
      toColumnId: newColumnId,
      newIndex: newIndex
    });

    // Викликаємо onMove з усіма параметрами
    onMove(task.id, task.columnId, newColumnId, newIndex);
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
    id: PropTypes.string.isRequired,
    columnId: PropTypes.string,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tasks: PropTypes.array,
    })
  ).isRequired,
  onMove: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};