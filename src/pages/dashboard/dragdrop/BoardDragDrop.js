import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../../components/board/column/Column";
import styles from "./BoardDragDrop.module.css";
import { reorderColumns } from "../../../utils/board";
import AddColumnButton from "../../../components/board/column/addColumnButton/AddColumnButton";

const BoardDragDrop = ({
  columnsWithTasks,
  isAddingColumn,
  addColumn,
  addTask,
  moveTask,
  saveTask,
  deleteTask,
  deleteColumn,
  queueColumnsOrder,
}) => {
  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) {
      console.log("Drag cancelled: No destination");
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log("Drag cancelled: Same position");
      return;
    }

    console.log("onDragEnd:", { draggableId, type, source, destination });

    if (type === "COLUMN") {
      const reordered = reorderColumns(columnsWithTasks, source.index, destination.index);
      
      // ✅ ПРАВИЛЬНО: передаємо тільки один раз
      const payload = reordered.map((column, idx) => ({
        id: String(column.id),
        order: idx // Використовуємо новий індекс як порядок
      }));
      
      console.log("Reordered columns:", payload);
      queueColumnsOrder(payload);
      
    } else if (type === "TASK") {
      moveTask(
        String(draggableId), 
        String(source.droppableId), 
        String(destination.droppableId), 
        destination.index
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.board}>
        {columnsWithTasks.map((col, index) => (
          <Column
            key={String(col.id)}
            column={col}
            columns={columnsWithTasks}
            addTask={addTask}
            moveTask={moveTask}
            saveTask={saveTask}
            deleteTask={deleteTask}
            onDeleteColumn={deleteColumn}
            index={index}
          />
        ))}
        
        {/* Додаємо AddColumnButton */}
        <div className={styles.addColumnSection}>
          <AddColumnButton 
            onColumnAdded={addColumn} 
            currentColumnsCount={columnsWithTasks.length}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardDragDrop;