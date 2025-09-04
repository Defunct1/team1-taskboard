import React from 'react';
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../../components/board/column/Column";
import styles from './BoardDragDrop.module.css';

const BoardDragDrop = ({
  columnsWithTasks,   // локальний масив UI
  onDragEnd,          // для тасок
  addColumn,
  isAddingColumn,
  addTask,
  moveTask,
  deleteTask,
  deleteColumn
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.board}>
        {columnsWithTasks.map((col, index) => (
          <Column
            key={col.id}
            column={col}
            columns={columnsWithTasks}
            addTask={addTask}
            moveTask={moveTask}
            deleteTask={deleteTask}
            onDeleteColumn={deleteColumn}
            index={index}
          />
        ))}

        <div className={styles.addColumnSection}>
          <button
            onClick={() => addColumn()}
            className={styles.addColumnBtn}
            disabled={isAddingColumn}
          >
            {isAddingColumn ? 'Додавання...' : '+ Додати колонку'}
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardDragDrop;