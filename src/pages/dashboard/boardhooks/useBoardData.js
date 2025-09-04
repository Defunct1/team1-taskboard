import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../utils/firebase/firebase";

export const useBoardData = () => {
  const [columnsWithTasks, setColumnsWithTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Підписка на колонки
    const colRef = collection(db, "columns");
    const colQuery = query(colRef, orderBy("order", "asc"));

    const unsubscribeColumns = onSnapshot(colQuery, (colSnapshot) => {
      const cols = colSnapshot.docs.map((colDoc) => ({
        id: colDoc.id,
        ...colDoc.data(),
        tasks: [], // завжди пустий масив для тасків
      }));

      // Підписка на таски всіх колонок одночасно
      const tasksRef = collection(db, "tasks");
      const unsubscribeTasks = onSnapshot(tasksRef, (taskSnapshot) => {
        const allTasks = taskSnapshot.docs.map((t) => ({
          id: t.id,
          ...t.data(),
        }));

        // Заповнюємо таски по колонках
        const merged = cols.map((col) => ({
          ...col,
          tasks: allTasks.filter((t) => t.columnId === col.id),
        }));

        setColumnsWithTasks(merged);
        setLoading(false);
      });

      // Очистка тасків при відписці
      return () => unsubscribeTasks();
    });

    return () => unsubscribeColumns();
  }, []);

  return { columnsWithTasks, loading };
};
