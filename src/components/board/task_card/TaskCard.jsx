import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../ui/button/Button";
import TaskDetailsModal from "../taskdetailsmodal/TaskDetailsModal";
import DropdownPortal from "../../dropdown/DropdownPortal";
import styles from "./TaskCard.module.css";
import { updateTask, moveTaskToColumn } from "../../../services/tasks";

function TaskCard({ task, columns, moveTask }) {
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
      await moveTaskToColumn(task.id, newColumnId);
      moveTask(task.id, task.columnId, newColumnId);
    } catch (error) {
      console.error("Помилка переміщення:", error);
    } finally {
      setIsMoving(false);
    }
  };

  const availableColumns = columns.filter((col) => col.id !== task.columnId);

  return (
    <>
      <div
        className={styles.card}
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
              setIsDropdownOpen((prev) => !prev);
            }}
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
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default TaskCard;
