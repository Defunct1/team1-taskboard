import React, { useEffect, useState } from "react";
import styles from './BoardPage.module.css';
import { useBoardData } from "../../pages/dashboard/boardhooks/useBoardData";
import { useBoardActions } from "../../pages/dashboard/boardhooks/useBoardActions";
import { EditOverlay } from "../../pages/dashboard/overlay/EditOverlay";
import BoardDragDrop from "../../pages/dashboard/dragdrop/BoardDragDrop";

export default function BoardPage() {
  const { columnsWithTasks, loading } = useBoardData();
  const {
    isAddingColumn,
    isEditing,
    pendingChanges,
    addColumn,
    deleteColumn,
    addTask,
    deleteTask,
    moveTaskLocally,
    queueColumnsOrder,
    cancelChanges,
    saveChanges,
  } = useBoardActions();

  // Локальний UI для drag&drop
  const [uiColumns, setUiColumns] = useState([]);

  // Синхронізація локального UI зі свіжими даними
  useEffect(() => {
    if (!isEditing && columnsWithTasks) {
      setUiColumns(columnsWithTasks);
    }
  }, [columnsWithTasks, isEditing]);

  // Drag & Drop
  const handleDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      const next = Array.from(uiColumns);
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);

      setUiColumns(next);
      queueColumnsOrder(next.map((c, idx) => ({ id: c.id, order: idx })));
      return;
    }

    if (type === "TASK") {
      const sourceColIndex = uiColumns.findIndex(c => String(c.id) === String(source.droppableId));
      const destColIndex = uiColumns.findIndex(c => String(c.id) === String(destination.droppableId));
      if (sourceColIndex === -1 || destColIndex === -1) return;

      const next = uiColumns.map(c => ({ ...c, tasks: [...(c.tasks || [])] }));
      const [movedTask] = next[sourceColIndex].tasks.splice(source.index, 1);
      next[destColIndex].tasks.splice(destination.index, 0, movedTask);

      setUiColumns(next);
      moveTaskLocally(draggableId, source.droppableId, destination.droppableId, destination.index);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>⏳ Завантаження...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      {isEditing && (
        <EditOverlay
          pendingChanges={pendingChanges}
          onSave={saveChanges}
          onCancel={() => {
            setUiColumns(columnsWithTasks || []);
            cancelChanges();
          }}
          isSaving={false}
        />
      )}

      <BoardDragDrop
        columnsWithTasks={uiColumns}
        onDragEnd={handleDragEnd}
        addColumn={addColumn}
        isAddingColumn={isAddingColumn}
        addTask={addTask}
        moveTask={moveTaskLocally}
        deleteTask={deleteTask}
        deleteColumn={deleteColumn}
      />
    </div>
  );
}
