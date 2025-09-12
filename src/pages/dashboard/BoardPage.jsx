import React from "react";
import styles from "./BoardPage.module.css";
import { useBoardActions } from "./boardhooks/useBoardActions";
import { EditOverlay } from "./overlay/EditOverlay";
import BoardDragDrop from "./dragdrop/BoardDragDrop";

export default function BoardPage() {
  const {
    columnsWithTasks,
    loading,
    isAddingColumn,
    // isEditing,
    pendingChanges,
    deleteColumn,
    addTask,
    deleteTask,
    moveTaskLocally,
    saveTask,
    queueColumnsOrder,
    cancelChanges,
    saveChanges,
  } = useBoardActions();

  if (loading) {
    return <div className={styles.loadingContainer}>⏳ Завантаження...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      {/* DEBUG PANEL */}
      {/* <div className={styles.debugPanel}>
        <strong>DEBUG:</strong>
        <pre>isEditing: {JSON.stringify(isEditing)}</pre>
        <pre>pendingChanges: {JSON.stringify(pendingChanges, null, 2)}</pre>
        <pre>columnsWithTasks: {JSON.stringify(columnsWithTasks, null, 2)}</pre>
      </div> */}

      {pendingChanges.length > 0 && (
        <EditOverlay
          pendingChanges={pendingChanges}
          onSave={saveChanges}
          onCancel={cancelChanges}
          isSaving={isAddingColumn}
        />
      )}

      <div className={styles.boardWrapper}>
        <BoardDragDrop
          columnsWithTasks={columnsWithTasks}
          isAddingColumn={isAddingColumn}
          addTask={addTask}
          moveTask={moveTaskLocally}
          saveTask={saveTask}
          deleteTask={deleteTask}
          deleteColumn={deleteColumn}
          queueColumnsOrder={queueColumnsOrder}
        />
      </div>
    </div>
  );
}