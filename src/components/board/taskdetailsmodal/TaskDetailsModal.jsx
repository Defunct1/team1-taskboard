import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Button from "../../ui/button/Button";
import styles from "./TaskDetailsModal.module.css";
import { updateTask } from "../../../services/tasks";
import { v4 as uuidv4 } from "uuid";

export default function TaskDetailsModal({
  task,
  columns,
  onClose,
  onMove,
  onSave,
  isSaving,
}) {
  const [title, setTitle] = useState(task.text || "");
  const [labels, setLabels] = useState(task.labels || []);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelColor, setNewLabelColor] = useState("#ff4d4f");
  const [newLabelText, setNewLabelText] = useState("");
  const [localSaving, setLocalSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = async () => {
    setLocalSaving(true);
    try {
      await updateTask(task.id, {
        text: title,
        labels: labels.map((l) => ({ id: l.id, color: l.color, text: l.text || "" })),
      });
      onSave?.();
      onClose();
    } catch (err) {
      console.error("Помилка збереження:", err);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleAddLabel = () => {
    if (!newLabelColor) return;
    setLabels([...labels, { id: uuidv4(), color: newLabelColor, text: newLabelText.trim() }]);
    setIsAddingLabel(false);
    setNewLabelText("");
  };

  const handleRemoveLabel = (id) => setLabels(labels.filter((l) => l.id !== id));

  // Закриття модалки через ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Закриття dropdown при кліку поза межами
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDropdownPortal = () => {
    if (!dropdownOpen || !buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    return ReactDOM.createPortal(
      <div
        className={styles.moveDropdown}
        style={{
          position: "fixed",
          top: rect.bottom + 4 + "px",
          left: rect.left + "px",
          minWidth: rect.width + "px",
          zIndex: 10000,
        }}
      >
        {columns.filter((col) => col.id !== task.columnId).map((col) => (
          <button
            key={col.id}
            onClick={() => {
              onMove(col.id);
              setDropdownOpen(false);
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

  const colorPalette = ["#4bce97","#e774bb","#faa53d","#9f8fef","#e44d40","#1dd1a1","#ff6b6b","#feca57","#00a8cc","#f39c12","#8e44ad","#2ecc71"];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className={styles.titleInput}
          placeholder="Назва завдання"
          rows={1}
          autoFocus
        />

        {/* Мітки */}
        <div className={styles.section}>
          <div className={styles.labelsHeader}>
            <h3>Мітки</h3>
            <Button
              onClick={() => setIsAddingLabel(!isAddingLabel)}
              variant="ghost"
              size="small"
            >
              {isAddingLabel ? "× Скасувати" : "+ Додати мітку"}
            </Button>
          </div>
          <div className={styles.labelsContainer}>
            {labels.map((l) => (
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
                    className={`${styles.colorOption} ${newLabelColor===c ? styles.selected : ""}`}
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
              <Button onClick={handleAddLabel}>Додати мітку</Button>
            </div>
          )}
        </div>

        {/* Переміщення */}
        <div className={styles.section}>
          <h3>Перемістити в:</h3>
          <div className={styles.moveWrapper} ref={buttonRef}>
            <Button variant="secondary" onClick={() => setDropdownOpen(!dropdownOpen)}>
              Вибрати колонку
            </Button>
          </div>
          {renderDropdownPortal()}
        </div>

        {/* Кнопки дій */}
        <div className={styles.actionButtons}>
          <Button onClick={handleSave} disabled={localSaving || isSaving} isLoading={localSaving || isSaving}>
            Зберегти зміни
          </Button>
          <Button onClick={onClose} variant="secondary" disabled={localSaving || isSaving}>
            Скасувати
          </Button>
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
