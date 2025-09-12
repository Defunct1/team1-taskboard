import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../TaskDetailsModal.module.css";

export default function TaskCommentsSection({ task, setTask, isDisabled }) {
  console.log("TaskCommentsSection setTask is function:", typeof setTask === "function");

  const commentRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (commentRef.current) {
      const el = commentRef.current;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [text]);

  const addComment = () => {
    console.log("TaskCommentsSection addComment called");
    const trimmed = text.trim();
    if (!trimmed) return;
    if (typeof setTask !== "function") {
      console.error("setTask is not a function:", setTask);
      return;
    }
    const newComment = {
      id: Date.now(),
      text: trimmed,
      author: "Ти",
      createdAt: new Date().toISOString(),
    };
    setTask(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
    setText("");
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Коментарі</h3>

      <div>
        {(task.comments || []).map(c => (
          <div key={c.id} style={{ marginBottom: 6 }}>
            <strong>{c.author || "Користувач"}</strong> (
            {new Date(c.createdAt).toLocaleString("uk-UA")}):
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      <textarea
        ref={commentRef}
        value={text}
        placeholder="Написати коментар..."
        onChange={(e) => setText(e.target.value)}
        className={styles.descriptionInput}
        style={{ width: "100%", resize: "none", marginTop: 4 }}
        disabled={isDisabled}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <button
          className={styles.primary}
          onClick={addComment}
          disabled={isDisabled || !text.trim()}
        >
          Додати коментар
        </button>
      </div>
    </div>
  );
}

TaskCommentsSection.propTypes = {
  task: PropTypes.shape({
    comments: PropTypes.array,
  }).isRequired,
  setTask: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};