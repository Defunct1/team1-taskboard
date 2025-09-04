import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import Button from "../../ui/button/Button";
import TaskCard from "../task_card/TaskCard";
import styles from "./Column.module.css";
import { Droppable } from "@hello-pangea/dnd";
import ColumnHeader from "./ColumnHeader/ColumnHeader.jsx";

const Column = ({ column, columns = [], addTask, moveTask, deleteTask, onDeleteColumn, index }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Автопідгонка висоти textarea
  useEffect(() => {
    if (textareaRef.current && isAddingTask) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newTaskText, isAddingTask]);

  // Сортування задач
  const sortedTasks = useMemo(() => {
    return [...(column.tasks || [])].sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || Date.now());
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || Date.now());
      return aTime - bTime;
    });
  }, [column.tasks]);

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    setIsLoading(true);
    try {
      await addTask(column.id, newTaskText);
      setNewTaskText("");
      setIsAddingTask(false);
    } catch (error) {
      console.error("Помилка додавання:", error);
      alert(`Помилка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.column}>
      <ColumnHeader
        title={column.title}
        columnId={column.id}
        onDeleteColumn={onDeleteColumn}
      />

      <Droppable droppableId={String(column.id)} type="TASK">
        {(providedDroppable) => (
          <div
            className={styles.tasks}
            {...providedDroppable.droppableProps}
            ref={providedDroppable.innerRef}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={String(task.id || index)}
                task={task}
                columns={columns}
                moveTask={moveTask}
                index={index}
              />
            ))}
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>

      {isAddingTask ? (
        <div className={styles.addForm}>
          <textarea
            ref={textareaRef}
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Введіть текст завдання"
            className={styles.textarea}
            rows={1}
            autoFocus
          />
          <div className={styles.buttons}>
            <Button
              onClick={handleAddTask}
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Додати
            </Button>
            <Button
              onClick={() => setIsAddingTask(false)}
              variant="secondary"
              disabled={isLoading}
            >
              Скасувати
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAddingTask(true)} variant="secondary">
          + Додати завдання
        </Button>
      )}
    </div>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tasks: PropTypes.array,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tasks: PropTypes.array,
    })
  ).isRequired,
  addTask: PropTypes.func.isRequired,
  moveTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  onDeleteColumn: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Column;
