import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../../components/board/column/Column";
import styles from "./BoardDragDrop.module.css";
import { reorderColumns } from "../../../utils/board";
import AddColumnButton from "../../../components/board/column/addColumnButton/AddColumnButton";

const BoardDragDrop = ({
  columnsWithTasks,
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
    
    console.log("🎯 Drag result:", result);
    
    if (!destination) {
      console.log("❌ No destination - canceling");
      return;
    }
  
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      console.log("❌ Same position - canceling");
      return;
    }
  
    if (type === "COLUMN") {
      console.log("📦 Moving column");
      const reordered = reorderColumns(columnsWithTasks, source.index, destination.index);
      const payload = reordered.map((column, idx) => ({ id: String(column.id), order: idx }));
      queueColumnsOrder(payload); // ✅ Без .unwrap()
    } else if (type === "TASK") {
      console.log("✅ TASK drag - processing move");
      
      moveTask( // ✅ Без .unwrap()
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
