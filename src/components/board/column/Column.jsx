import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Button from "../../ui/button/Button";
import TaskCard from "../taskCard/TaskCard";
import styles from "./Column.module.css";
import { Droppable } from "@hello-pangea/dnd";
import ColumnHeader from "./ColumnHeader/ColumnHeader.jsx";

const Column = ({
  column,
  columns = [],
  addTask,
  moveTask,
  saveTask,
  deleteTask,
  onDeleteColumn,
  index,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
      textareaRef.current.style.height = "auto"; // спершу скидаємо висоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };
  

  // Sort tasks
  const sortedTasks = (column.tasks || []).slice().sort((a, b) => a.order - b.order);


  const handleAddTask = async () => {
    if (!newTaskText.trim()) {
      toast.error("Текст завдання не може бути порожнім");
      return;
    }

    setIsLoading(true);
    try {
      const newTaskData = {
        text: newTaskText.trim(),
        description: "",
        labels: [],
        comments: [],
        dueDate: null,
        columnId: column.id,
        status: "todo",
        order: sortedTasks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addTask(column.id, newTaskData);
      setNewTaskText("");
      setIsAddingTask(false);
    } catch (error) {
      console.error("Помилка додавання задачі:", error);
      toast.error(`Помилка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setNewTaskText("");
    setIsAddingTask(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
    if (e.key === "Escape") {
      handleCancelAdd();
    }
  };

  return (
    <div className={styles.column}>
      <ColumnHeader
        title={column.title}
        columnId={column.id}
        taskCount={sortedTasks.length}
        onDeleteColumn={onDeleteColumn}
      />

      <Droppable droppableId={String(column.id)} type="TASK">
        {(providedDroppable, snapshot) => (
          <div
            className={`${styles.tasks} ${snapshot.isDraggingOver ? styles.draggingOver : ""}`}
            {...providedDroppable.droppableProps}
            ref={providedDroppable.innerRef}
          >
            {sortedTasks.map((task, taskIndex) => (
              <TaskCard
                key={String(task.id)}
                task={task}
                columns={columns}
                moveTask={moveTask}
                saveTask={saveTask}
                deleteTask={deleteTask}
                index={taskIndex}
                isSaving={false} // або передайте реальний стан збереження
            />
            ))}
            {providedDroppable.placeholder}

            {sortedTasks.length === 0 && !isAddingTask && (
              <div className={styles.emptyState}>
                <p>Немає завдань</p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {isAddingTask ? (
        <div className={styles.addForm}>
          <textarea
            ref={textareaRef}
            value={newTaskText}
            onChange={(e) => {
              setNewTaskText(e.target.value);
              resizeTextarea();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Введіть текст завдання..."
            className={styles.textarea}
            rows={1}
            autoFocus
            maxLength={500}
          />

          <div className={styles.textCounter}>
            {newTaskText.length}/500 символів
          </div>
          <div className={styles.buttons}>
            <Button
              onClick={handleAddTask}
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !newTaskText.trim()}
            >
              {isLoading ? "Додавання..." : "Додати"}
            </Button>
            <Button
              onClick={handleCancelAdd}
              variant="secondary"
              disabled={isLoading}
            >
              Скасувати
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingTask(true)}
          variant="secondary"
          className={styles.addButton}
        >
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
  saveTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  onDeleteColumn: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Column;