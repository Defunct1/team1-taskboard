import React, { useState } from "react";
import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import TaskDetailsModal from "../taskdetailsmodal/TaskDetailsModal";
import styles from "./TaskCard.module.css";

export default function TaskCard({ 
  task, 
  index, 
  columns, 
  saveTask, 
  deleteTask, 
  moveTask, 
  isPending = false,
  isSaving = false
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (updatedTask) => {
    try {
      await saveTask(updatedTask);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Помилка збереження:", error);
    }
  };

  // ✅ Виправлена функція для передачі в onMove
  const handleMove = (taskId, fromColumnId, toColumnId, newIndex) => {
    console.log("TaskCard handleMove:", { taskId, fromColumnId, toColumnId, newIndex });
    if (moveTask) {
      moveTask(taskId, fromColumnId, toColumnId, newIndex);
    }
  };

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index} isDragDisabled={isPending}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.card} ${isPending ? styles.pendingTask : ""}`}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.8 : 1,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
            onClick={() => !isPending && setIsModalOpen(true)}
          >
            <p className={styles.text}>{task.text}</p>

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

            <div className={`${styles.status} ${styles[task.status || "todo"]}`} />
          
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
          onMove={handleMove} // ✅ передаємо виправлену функцію
          moveTask={moveTask} // для сумісності
          isSaving={isSaving}
          onDelete={() => deleteTask(task.id, task.columnId)}
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
  isSaving: PropTypes.bool,
};

TaskCard.defaultProps = {
  isPending: false,
  isSaving: false,
};