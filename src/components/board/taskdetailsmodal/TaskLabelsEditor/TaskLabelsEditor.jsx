import { useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import styles from "../TaskDetailsModal.module.css";

export default function TaskLabelsEditor({ task, setTask, isDisabled }) {
  const [adding, setAdding] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [labelColor, setLabelColor] = useState("#4bce97");

  const palette = [
    "#4bce97", "#e774bb", "#faa53d", "#9f8fef", "#e44d40",
    "#1dd1a1", "#ff6b6b", "#feca57", "#00a8cc", "#f39c12",
    "#8e44ad", "#2ecc71",
  ];

  const addLabel = () => {
    // Дозволяємо створювати мітки без тексту, але з кольором
    if (!labelColor) return;

    setTask(prev => ({
      ...prev,
      labels: [
        ...(prev.labels || []),
        { 
          id: uuidv4(), 
          text: labelText.trim(), 
          color: labelColor 
        }
      ],
    }));

    setLabelText("");
    setLabelColor("#4bce97"); // Скидаємо до стандартного кольору
    setAdding(false);
  };

  const removeLabel = (id) => {
    setTask(prev => ({
      ...prev,
      labels: (prev.labels || []).filter(l => l.id !== id),
    }));
  };

  const handleColorSelect = (color) => {
    setLabelColor(color);
    // Автоматично додаємо мітку при виборі кольору, якщо хочете
    // Як варіант: раскоментуйте наступний рядок:
    // addLabel();
  };

  const cancelAdding = () => {
    setAdding(false);
    setLabelText("");
    setLabelColor("#4bce97");
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Мітки</h3>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => setAdding(!adding)}
          disabled={isDisabled}
        >
          {adding ? "× Скасувати" : "+ Додати"}
        </button>
      </div>

      <div className={styles.labelsContainer}>
        {(task.labels || []).map(l => (
          <div key={l.id} className={styles.label} style={{ background: l.color }}>
            {l.text && <span className={styles.labelText}>{l.text}</span>}
            <button
              type="button"
              className={styles.removeLabel}
              onClick={() => removeLabel(l.id)}
              disabled={isDisabled}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {adding && (
        <div className={styles.addLabelForm}>
          <div className={styles.colorPicker}>
            <div className={styles.selectedColorPreview}>
              Обраний колір: 
              <span 
                className={styles.colorPreview} 
                style={{ background: labelColor }}
              />
            </div>
            {palette.map(color => (
              <button
                key={color}
                type="button"
                className={`${styles.colorOption} ${labelColor === color ? styles.selected : ""}`}
                style={{ background: color }}
                onClick={() => setLabelColor(color)}
                disabled={isDisabled}
                title={color}
              />
            ))}
          </div>
          
          <input
            type="text"
            className={styles.labelInput}
            value={labelText}
            onChange={e => setLabelText(e.target.value)}
            placeholder="Назва мітки (необов'язково)"
            disabled={isDisabled}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addLabel();
              }
            }}
          />
          
          <div className={styles.addCancelButtons}>
            <button
              type="button"
              className={styles.primary}
              onClick={addLabel}
              disabled={isDisabled || !labelColor}
            >
              Додати мітку
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={cancelAdding}
              disabled={isDisabled}
            >
              Скасувати
            </button>
          </div>

          {/* Додатковий спосіб: додавати мітку просто кліком на колір */}
          <div className={styles.quickAddHint}>
            <small>Клікніть на колір, потім на "Додати мітку"</small>
          </div>
        </div>
      )}

      {/* Показуємо обраний колір навіть коли форма не активна */}
      {!adding && (
        <div className={styles.currentColorInfo}>
          <small>Наступна мітка буде кольору: </small>
          <span 
            className={styles.colorPreviewSmall} 
            style={{ background: labelColor }}
            title={labelColor}
          />
        </div>
      )}
    </div>
  );
}

TaskLabelsEditor.propTypes = {
  task: PropTypes.shape({
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string,
        color: PropTypes.string,
      })
    ),
  }).isRequired,
  setTask: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

TaskLabelsEditor.defaultProps = {
  isDisabled: false,
};