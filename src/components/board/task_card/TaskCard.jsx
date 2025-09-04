import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import Button from "../../ui/button/Button";
import TaskDetailsModal from "../taskdetailsmodal/TaskDetailsModal";
import DropdownPortal from "../../dropdown/DropdownPortal";
import styles from "./TaskCard.module.css";

function TaskCard({ task, index, columns, moveTask, isPending }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Закриття dropdown при кліку поза його межами
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !dropdownButtonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMove = async (newColumnId) => {
    if (task.columnId === newColumnId) return;
    setIsMoving(true);
    setIsDropdownOpen(false);

    try {
      // Викликаємо moveTask з хука, він уже робить локальне переміщення та збереження
      await moveTask(task.id, task.columnId, newColumnId);
    } catch (error) {
      console.error("Помилка переміщення:", error);
    } finally {
      setIsMoving(false);
    }
  };

  const availableColumns = columns?.filter((col) => col.id !== task.columnId) || [];

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isPending}>
      {(provided, snapshot) => (
        <>
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
            onClick={() => setIsModalOpen(true)}
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

            <div className={styles.controls}>
              <Button
                variant="text"
                size="small"
                ref={dropdownButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPending) setIsDropdownOpen((prev) => !prev);
                }}
                disabled={isPending}
              >
                Перемістити
              </Button>

              {isDropdownOpen && (
                <DropdownPortal isOpen={isDropdownOpen} anchorRef={dropdownButtonRef}>
                  <div className={styles.moveDropdown} ref={dropdownRef}>
                    {availableColumns.map((column) => (
                      <button
                        key={column.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(column.id);
                        }}
                        disabled={isMoving}
                      >
                        {column.title}
                      </button>
                    ))}
                  </div>
                </DropdownPortal>
              )}
            </div>
          </div>

          {isModalOpen && (
            <TaskDetailsModal
              task={task}
              columns={columns}
              onClose={() => setIsModalOpen(false)}
              onMove={handleMove}
              onSave={() => {}}
              isSaving={isMoving}
            />
          )}
        </>
      )}
    </Draggable>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  moveTask: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
};

TaskCard.defaultProps = {
  isPending: false,
};

export default TaskCard;
