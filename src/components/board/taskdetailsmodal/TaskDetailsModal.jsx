import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./TaskDetailsModal.module.css";
import { toast } from "react-toastify";
import TaskModalHeader from "./TaskModalHeader.jsx";
import TaskModalTextFields from "./TaskModalTextFields.jsx";
import TaskLabelsEditor from "./TaskLabelsEditor/TaskLabelsEditor.jsx";
import TaskCommentsSection from "./TaskCommentsSection/TaskCommentsSection.jsx";
import TaskMoveDropdown from "./TaskMoveDropdown.jsx";
import TaskModalActions from "./TaskModalActions/TaskModalActions.jsx";

export default function TaskDetailsModal({
  task: initialTask,
  columns,
  onClose,
  onMove,
  onSave,
  isSaving,
}) {
  const [task, setTask] = useState(() => ({
    id: initialTask?.id ?? "",
    text: initialTask?.text ?? "",
    description: initialTask?.description ?? "",
    labels: Array.isArray(initialTask?.labels) ? initialTask.labels : [],
    comments: Array.isArray(initialTask?.comments) ? initialTask.comments : [],
    columnId: initialTask?.columnId ?? "",
    status: initialTask?.status ?? "todo",
    dueDate: initialTask?.dueDate ?? null,
    createdAt: initialTask?.createdAt ?? new Date().toISOString(),
    updatedAt: initialTask?.updatedAt ?? new Date().toISOString(),
    order: initialTask?.order ?? 0,
  }));

  const [localSaving, setLocalSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    console.log("TaskDetailsModal setTask is function:", typeof setTask === "function");
  }, []);

  useEffect(() => {
    setTask({
      id: initialTask?.id ?? "",
      text: initialTask?.text ?? "",
      description: initialTask?.description ?? "",
      labels: Array.isArray(initialTask?.labels) ? initialTask.labels : [],
      comments: Array.isArray(initialTask?.comments) ? initialTask.comments : [],
      columnId: initialTask?.columnId ?? "",
      status: initialTask?.status ?? "todo",
      dueDate: initialTask?.dueDate ?? null,
      createdAt: initialTask?.createdAt ?? new Date().toISOString(),
      updatedAt: initialTask?.updatedAt ?? new Date().toISOString(),
      order: initialTask?.order ?? 0,
    });
  }, [initialTask]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 180);
  }, [onClose]);

  const handleSave = useCallback(async () => {
    if (!task.text?.trim()) {
      toast.error("Назва не може бути порожньою");
      return;
    }

    setLocalSaving(true);
    try {
      const taskToSave = {
        ...task,
        updatedAt: new Date().toISOString(),
      };
      await onSave?.(taskToSave);
      handleClose();
    } catch (err) {
      console.error("Помилка збереження:", err);
      toast.error("Не вдалося зберегти задачу");
    } finally {
      setLocalSaving(false);
    }
  }, [task, onSave, handleClose]);

  const handleMove = useCallback((newColumnId) => {
    if (onMove) {
      // ✅ ПРАВИЛЬНО: передаємо task.id ТА newColumnId
      onMove(task.id, newColumnId);
      handleClose();
    }
  }, [onMove, task.id, handleClose]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${Math.min(titleRef.current.scrollHeight, 120)}px`;
    }
  }, [task.text]);

  const handleTitleChange = useCallback(
    (e) => {
      console.log("TaskDetailsModal handleTitleChange called");
      setTask((prev) => ({ ...prev, text: e.target.value }));
    },
    [setTask]
  );

  const saving = localSaving || isSaving;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ""}`}
      onClick={handleClose}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <TaskModalHeader task={task} onClose={handleClose} />
        <textarea
          ref={titleRef}
          className={styles.titleInput}
          value={task.text}
          placeholder="Назва задачі..."
          onChange={handleTitleChange}
          rows={1}
          disabled={saving}
        />
        <div className={styles.mainContent}>
          <TaskModalTextFields task={task} setTask={setTask} isDisabled={saving} />
          <TaskCommentsSection task={task} setTask={setTask} isDisabled={saving} />
        </div>
        <div className={styles.sidebar}>
          <TaskLabelsEditor task={task} setTask={setTask} isDisabled={saving} />
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Дії</h3>
            <TaskMoveDropdown
              task={task}
              columns={columns}
              onMove={handleMove} // Use onMove instead of setTask
              isDisabled={saving}
            />
            <button
              className={styles.secondary}
              style={{ width: "100%", marginTop: 8 }}
              disabled={saving}
            >
              Копіювати
            </button>
            <button
              className={styles.secondary}
              style={{ width: "100%", marginTop: 8 }}
              disabled={saving}
            >
              В архів
            </button>
          </div>
        </div>
        <TaskModalActions
          task={task}
          onSave={handleSave}
          onClose={handleClose}
          isSaving={saving}
        />
      </div>
    </div>
  );
}

TaskDetailsModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    description: PropTypes.string,
    labels: PropTypes.array,
    comments: PropTypes.array,
    columnId: PropTypes.string,
    status: PropTypes.string,
    dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    order: PropTypes.number,
  }).isRequired,
  columns: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onMove: PropTypes.func,
  isSaving: PropTypes.bool,
};