import { useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import styles from "../TaskDetailsModal.module.css";

export default function TaskLabelsEditor({ task, setTask, isDisabled }) {
  console.log("TaskLabelsEditor setTask is function:", typeof setTask === "function");

  const [adding, setAdding] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [labelColor, setLabelColor] = useState("#4bce97");

  const palette = [
    "#4bce97",
    "#e774bb",
    "#faa53d",
    "#9f8fef",
    "#e44d40",
    "#1dd1a1",
    "#ff6b6b",
    "#feca57",
    "#00a8cc",
    "#f39c12",
    "#8e44ad",
    "#2ecc71",
  ];

  const add = () => {
    console.log("TaskLabelsEditor add called");
    if (typeof setTask !== "function") {
      console.error("setTask is not a function:", setTask);
      return;
    }
    setTask(prev => ({
      ...prev,
      labels: [...(prev.labels || []), { id: uuidv4(), color: labelColor, text: labelText.trim() }],
    }));
    setLabelText("");
    setAdding(false);
  };

  const remove = (id) => {
    console.log("TaskLabelsEditor remove called with id:", id);
    if (typeof setTask !== "function") {
      console.error("setTask is not a function:", setTask);
      return;
    }
    setTask(prev => ({ ...prev, labels: (prev.labels || []).filter(l => l.id !== id) }));
  };

  return (
    <div className={styles.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className={styles.sectionTitle}>Мітки</h3>
        <button
          className={styles.secondary}
          onClick={() => setAdding(v => !v)}
          disabled={isDisabled}
        >
          {adding ? "× Скасувати" : "+ Додати"}
        </button>
      </div>

      <div className={styles.labelsContainer}>
        {(task.labels || []).map(l => (
          <div key={l.id} className={styles.label} style={{ background: l.color }}>
            {l.text ? <span className={styles.labelText}>{l.text}</span> : null}
            <button
              className={styles.removeLabel}
              onClick={() => remove(l.id)}
              disabled={isDisabled}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {adding && (
        <div style={{ marginTop: 8 }}>
          <div className={styles.colorPicker}>
            {palette.map(c => (
              <button
                key={c}
                type="button"
                className={`${styles.colorOption} ${labelColor === c ? styles.selected : ""}`}
                style={{ background: c }}
                onClick={() => setLabelColor(c)}
                disabled={isDisabled}
              />
            ))}
          </div>
          <input
            className={styles.labelInput}
            value={labelText}
            onChange={e => setLabelText(e.target.value)}
            placeholder="Назва (необов'язково)"
            disabled={isDisabled}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button className={styles.primary} onClick={add} disabled={isDisabled}>
              Додати
            </button>
            <button
              className={styles.secondary}
              onClick={() => setAdding(false)}
              disabled={isDisabled}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

TaskLabelsEditor.propTypes = {
  task: PropTypes.shape({
    labels: PropTypes.array,
  }).isRequired,
  setTask: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};