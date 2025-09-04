import { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styles from "./TaskDetailsModal.module.css";
import { updateTask } from "../../../services/tasks";
import { v4 as uuidv4 } from "uuid";

export default function TaskDetailsModal({ task, columns, onClose, onMove, onSave, isSaving }) {
  const [editableTask, setEditableTask] = useState({ ...task });
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelColor, setNewLabelColor] = useState("#4bce97");
  const [newLabelText, setNewLabelText] = useState("");
  const [localSaving, setLocalSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const buttonRef = useRef(null);
  const textareaRef = useRef(null);
  const commentRef = useRef(null);

  // Синхронізація з пропсом
  useEffect(() => {
    setEditableTask({ 
      ...task, 
      text: task.text || "", 
      description: task.description || "", 
      labels: task.labels || [] 
    });
  }, [task]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  const resizeTextarea = useCallback((el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    [textareaRef.current, commentRef.current].forEach(resizeTextarea);
    const handleResize = () => [textareaRef.current, commentRef.current].forEach(resizeTextarea);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeTextarea]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !localSaving && !isSaving) handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [localSaving, isSaving, handleClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (!editableTask.text.trim()) return alert("Назва завдання не може бути порожньою!");
    setLocalSaving(true);
    try {
      await updateTask(task.id, {
        text: editableTask.text,
        description: editableTask.description,
        labels: editableTask.labels.map((l) => ({ id: l.id, color: l.color, text: l.text || "" })),
        columnId: editableTask.columnId,
      });
      onSave?.();
      handleClose();
    } catch (err) {
      console.error("Помилка збереження:", err);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleAddLabel = () => {
    setEditableTask((prev) => ({
      ...prev,
      labels: [...prev.labels, { id: uuidv4(), color: newLabelColor, text: newLabelText.trim() }],
    }));
    setNewLabelText("");
    setIsAddingLabel(false);
  };

  const handleRemoveLabel = (id) => setEditableTask((prev) => ({ ...prev, labels: prev.labels.filter((l) => l.id !== id) }));

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    console.log("Додано коментар:", commentText);
    setCommentText("");
    resizeTextarea(commentRef.current);
  };

  const renderDropdownPortal = () => {
    if (!dropdownOpen || !buttonRef.current || typeof document === "undefined") return null;
    const rect = buttonRef.current.getBoundingClientRect();
    return ReactDOM.createPortal(
      <div
        className={styles.moveDropdown}
        style={{
          position: "fixed",
          top: rect.bottom + window.scrollY + 6 + "px",
          left: rect.left + window.scrollX + "px",
          minWidth: rect.width + "px",
          zIndex: 10000,
        }}
      >
        {columns.filter((c) => c.id !== editableTask.columnId).map((col) => (
          <button
            key={col.id}
            onClick={async () => {
              try {
                await updateTask(task.id, { columnId: col.id });
                onMove(col.id);
                setEditableTask((prev) => ({ ...prev, columnId: col.id }));
                setDropdownOpen(false);
              } catch (err) {
                console.error("Помилка переміщення:", err);
              }
            }}
            disabled={localSaving || isSaving}
          >
            {col.title}
          </button>
        ))}
      </div>,
      document.body
    );
  };

  const colorPalette = [
    "#4bce97","#e774bb","#faa53d","#9f8fef","#e44d40",
    "#1dd1a1","#ff6b6b","#feca57","#00a8cc","#f39c12",
    "#8e44ad","#2ecc71"
  ];

  return (
    <div className={styles.modalOverlay} onClick={handleClose} style={{ animation: isClosing ? "fadeOut 0.2s ease-out forwards" : "" }}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ animation: isClosing ? "fadeOut 0.2s ease-out forwards" : "" }}>
        <div className={styles.header}>
          <h2>{editableTask.text || "Нова картка"}</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        <textarea
          ref={textareaRef}
          value={editableTask.text}
          onChange={(e) => { setEditableTask((prev) => ({ ...prev, text: e.target.value })); resizeTextarea(e.target); }}
          className={styles.titleInput}
          placeholder="Назва завдання"
          rows={1}
        />

        <div className={styles.section}>
          <span className={styles.columnInfo}>
            У колонці: <strong>{columns.find((c) => c.id === editableTask.columnId)?.title || "—"}</strong>
          </span>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Опис</h3>
            <textarea
              value={editableTask.description}
              onChange={(e) => { setEditableTask((prev) => ({ ...prev, description: e.target.value })); resizeTextarea(e.target); }}
              className={styles.descriptionInput}
              placeholder="Додати детальніший опис..."
              rows={3}
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Коментарі</h3>
            <div className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>Dentis Bien</span>
                <span className={styles.commentTime}>11 вер. 2025 р., 16:06</span>
              </div>
              <p className={styles.commentText}>додав(ла) цю картку до BackLog</p>
            </div>
            <div className={styles.addComment}>
              <textarea
                ref={commentRef}
                value={commentText}
                onChange={(e) => { setCommentText(e.target.value); resizeTextarea(e.target); }}
                className={styles.commentInput}
                placeholder="Написати коментар..."
                rows={2}
              />
              <button className="primary" onClick={handleAddComment} disabled={!commentText.trim()}>
                Додати коментар
              </button>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.section}>
            <div className={styles.labelsHeader}>
              <h3 className={styles.sectionTitle}>Мітки</h3>
              <button className="secondary" onClick={() => setIsAddingLabel(!isAddingLabel)}>
                {isAddingLabel ? "× Скасувати" : "+ Додати мітку"}
              </button>
            </div>

            <div className={styles.labelsContainer}>
              {editableTask.labels.map((l) => (
                <div key={l.id} className={styles.label}>
                  <span className={styles.labelColor} style={{ backgroundColor: l.color }} />
                  {l.text && <span className={styles.labelText}>{l.text}</span>}
                  <button className={styles.removeLabel} onClick={() => handleRemoveLabel(l.id)}>×</button>
                </div>
              ))}
            </div>

            {isAddingLabel && (
              <div className={styles.addLabelForm}>
                <div className={styles.colorPicker}>
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      className={`${styles.colorOption} ${newLabelColor === c ? styles.selected : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewLabelColor(c)}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={newLabelText}
                  onChange={(e) => setNewLabelText(e.target.value)}
                  placeholder="Назва мітки (необов'язково)"
                  className={styles.labelInput}
                />
                <button className="primary" onClick={handleAddLabel}>Додати мітку</button>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Дії</h3>
            <div ref={buttonRef}>
              <button className="secondary" style={{ width: "100%", marginBottom: "8px" }} onClick={() => setDropdownOpen(!dropdownOpen)}>Перемістити</button>
            </div>
            {renderDropdownPortal()}
            <button className="secondary" style={{ width: "100%", marginBottom: "8px" }}>Копіювати</button>
            <button className="secondary" style={{ width: "100%" }}>В архів</button>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className="primary" onClick={handleSave} disabled={localSaving || isSaving}>Зберегти зміни</button>
          <button className="secondary" onClick={handleClose} disabled={localSaving || isSaving}>Скасувати</button>
        </div>
      </div>
    </div>
  );
}

TaskDetailsModal.propTypes = {
  task: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};
