import React, { useState } from "react";
import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import TaskDetailsModal from "../taskdetailsmodal/TaskDetailsModal";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, index, columns, saveTask, deleteTask, moveTask, isPending = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (updatedTask) => {
    try {
      await saveTask(updatedTask);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Помилка збереження:", error);
    }
  };

  // const handleMove = async (newColumnId) => {
  //   try {
  //     await moveTask(task.id, newColumnId);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Помилка переміщення:", error);
  //   }
  // };

  const handleDelete = async () => {
    if (window.confirm("Видалити це завдання?")) {
      try {
        await deleteTask(task.id);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Помилка видалення:", error);
      }
    }
  };

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index} isDragDisabled={isPending}>
        {(provided, snapshot) => (
          <div
            className={`${styles.card} ${isPending ? styles.pendingTask : ""}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.8 : 1,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
            onClick={() => !isPending && setIsModalOpen(true)}
          >
            <p className={styles.text}>{task.text}</p>

            {/* ✅ Відображення міток */}
            {task.labels?.length > 0 && (
              <div className={styles.taskLabels}>
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className={styles.taskLabel}
                    style={{ backgroundColor: label.color }}
                    title={label.text}
                  />
                ))}
              </div>
            )}

            {/* ✅ Індикатор статусу */}
            <div className={`${styles.status} ${styles[task.status || "todo"]}`} />

            {/* ✅ Інформація про коментарі */}
            {task.comments?.length > 0 && (
              <div className={styles.commentsBadge}>
                💬 {task.comments.length}
              </div>
            )}
          </div>
        )}
      </Draggable>

      {isModalOpen && (
        <TaskDetailsModal
          task={task}
          columns={columns}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onMove={moveTask}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    labels: PropTypes.array,
    comments: PropTypes.array,
    status: PropTypes.string,
    columnId: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  saveTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  moveTask: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
};

TaskCard.defaultProps = {
  isPending: false,
};