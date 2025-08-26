import { useState, useEffect } from "react";
import styles from "./BoardPage.module.css";
import Column from "../../components/board/column/Column";
import { collection, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";

export default function BoardPage() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Підписка на колонки
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "columns"),
      (snapshot) => {
        const columnsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setColumns(columnsData);
        setLoading(false);
        console.log("Колонки для рендеру:", columnsData);
      },
      (error) => {
        console.error("Помилка завантаження колонок:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ---- Переміщення таска між колонками ----
  const moveTask = async (taskId, fromColumnId, toColumnId) => {
    const fromColumn = columns.find((col) => col.id === fromColumnId);
    const task = fromColumn?.tasks?.find((t) => t.id === taskId);

    if (!task) return;

    try {
      await updateDoc(doc(db, "tasks", taskId), {
        columnId: toColumnId,
        updatedAt: new Date(),
      });

      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          if (col.id === toColumnId) {
            return { ...col, tasks: [...(col.tasks || []), task] };
          }
          return col;
        })
      );
    } catch (error) {
      console.error("Помилка переміщення задачі:", error);
    }
  };

  // ---- Додавання нового таска ----
  const addTask = async (columnId, text) => {
    try {
      const newTaskRef = await addDoc(collection(db, "tasks"), {
        text,
        columnId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const newTask = { id: newTaskRef.id, text, columnId };

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === columnId
            ? { ...col, tasks: [...(col.tasks || []), newTask] }
            : col
        )
      );
    } catch (error) {
      console.error("Помилка додавання задачі:", error);
    }
  };

  // ---- Додавання нової колонки ----
  const handleAddColumn = async (columnId, position) => {
    try {
      const newColumnRef = await addDoc(collection(db, "columns"), {
        title: "Нова колонка",
        tasks: [],
        createdAt: new Date(),
      });
      const newColumn = { id: newColumnRef.id, title: "Нова колонка", tasks: [] };

      setColumns((prevColumns) => {
        const index = prevColumns.findIndex((col) => col.id === columnId);
        if (index === -1) return [...prevColumns, newColumn];

        const newColumns = [...prevColumns];
        if (position === "before") newColumns.splice(index, 0, newColumn);
        else if (position === "after") newColumns.splice(index + 1, 0, newColumn);
        return newColumns;
      });
    } catch (error) {
      console.error("Помилка додавання колонки:", error);
    }
  };

  return (
    <div className={styles.board}>
      {loading ? (
        <p>Завантаження колонок...</p>
      ) : columns.length === 0 ? (
        <p>Немає колонок. Додайте нову колонку!</p>
      ) : (
        columns.map((columnItem) => (
          <Column
            key={columnItem.id}
            column={columnItem}
            columns={columns}
            onAddColumn={handleAddColumn}
            moveTask={moveTask}
            addTask={addTask} // передаємо в Column
          />
        ))
      )}
    </div>
  );
}
