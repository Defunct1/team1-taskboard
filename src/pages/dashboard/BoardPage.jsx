// src/pages/dashboard/BoardPage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./BoardPage.module.css";
import BoardDragDrop from "../../pages/dashboard/dragdrop/BoardDragDrop";
import { EditOverlay } from "../../pages/dashboard/overlay/EditOverlay";
import {
  startBoardSync,
  stopBoardSync,
  moveTaskOptimistic,
  queueColumnsOrder,
  addColumn,
  addTask,
  deleteTask,
  deleteColumn,
  saveChanges,
  cancelChanges,
} from "../../store/boardSlice";

export default function BoardPage() {
  const dispatch = useDispatch();
  const { columns, loading, isEditing, pendingChanges } = useSelector((s) => s.board);

  useEffect(() => {
    dispatch(startBoardSync());
    return () => {
      dispatch(stopBoardSync());
    };
  }, [dispatch]);

  if (loading) return <div className={styles.loadingContainer}>⏳ Завантаження...</div>;

  return (
    <div className={styles.boardContainer}>
      {isEditing && (
        <EditOverlay
          pendingChanges={pendingChanges}
          onSave={() => dispatch(saveChanges())}
          onCancel={() => dispatch(cancelChanges())}
          isSaving={false}
        />
      )}

      {/* ✅ Тепер використовуємо актуальний стан з Redux */}
      <BoardDragDrop
        columnsWithTasks={columns || []}
        addColumn={(title) => dispatch(addColumn(title))}
        addTask={(colId, data) => dispatch(addTask(colId, data))}
        moveTask={(taskId, fromColumnId, toColumnId, newIndex) => 
          dispatch(moveTaskOptimistic({ taskId, fromColumnId, toColumnId, newIndex }))
        }
        saveTask={(task) => console.log("Save task:", task)}
        deleteTask={(id) => dispatch(deleteTask(id))}
        deleteColumn={(id) => dispatch(deleteColumn(id))}
        queueColumnsOrder={(order) => dispatch(queueColumnsOrder(order))}
      />
    </div>
  );
}