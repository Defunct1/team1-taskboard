// utils/board/reorderTasks.js
export function reorderTasks(columns, source, destination) {
    const updated = Array.from(columns);
  
    const sourceColIndex = updated.findIndex(c => c.id === source.droppableId);
    const destColIndex = updated.findIndex(c => c.id === destination.droppableId);
  
    const sourceCol = updated[sourceColIndex];
    const destCol = updated[destColIndex];
  
    const sourceTasks = Array.from(sourceCol.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);
  
    if (sourceColIndex === destColIndex) {
      // Пересування в межах однієї колонки
      sourceTasks.splice(destination.index, 0, movedTask);
      updated[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
    } else {
      // Пересування між колонками
      const destTasks = Array.from(destCol.tasks);
      destTasks.splice(destination.index, 0, movedTask);
  
      updated[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
      updated[destColIndex] = { ...destCol, tasks: destTasks };
    }
  
    return updated;
  }
  