// hooks/useBoardActions.js
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../utils/firebase/firebase";

export const useBoardActions = () => {
  const [columnsWithTasks, setColumnsWithTasks] = useState([]);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);

  // 🔹 Завантаження колонок і тасків
  const fetchColumnsWithTasks = async () => {
    try {
      const colSnap = await getDocs(collection(db, "columns"));
      const taskSnap = await getDocs(collection(db, "tasks"));

      const tasksByColumn = taskSnap.docs.reduce((acc, docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        acc[data.columnId] = acc[data.columnId] || [];
        acc[data.columnId].push(data);
        return acc;
      }, {});

      const columnsArr = colSnap.docs
        .map(docSnap => {
          const data = { id: docSnap.id, ...docSnap.data() };
          return { ...data, tasks: tasksByColumn[data.id] || [] };
        })
        .sort((a, b) => a.order - b.order);

      setColumnsWithTasks(columnsArr);
    } catch (err) {
      console.error("Помилка завантаження колонок з тасками:", err);
    }
  };

  useEffect(() => {
    fetchColumnsWithTasks();
  }, []);

  // 🔹 Локальне переміщення таску
  const moveTaskLocally = (taskId, fromColumnId, toColumnId, newIndex = null) => {
    setIsEditing(true);

    setColumnsWithTasks(prev => {
      const updated = [...prev];
      const fromCol = updated.find(c => c.id === fromColumnId);
      const toCol = updated.find(c => c.id === toColumnId);
      if (!fromCol || !toCol) return prev;

      const taskIndex = fromCol.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const [movedTask] = fromCol.tasks.splice(taskIndex, 1);
      const pendingTask = { ...movedTask, columnId: toColumnId, isPending: true };

      if (newIndex !== null) {
        toCol.tasks.splice(newIndex, 0, pendingTask);
      } else {
        toCol.tasks.push(pendingTask);
      }

      return updated;
    });

    setPendingChanges(prev => [
      ...prev.filter(c => !(c.type === "MOVE_TASK" && c.taskId === taskId)),
      { type: "MOVE_TASK", taskId, fromColumnId, toColumnId, newIndex }
    ]);
  };

  // 🔹 Збереження порядку колонок
  const queueColumnsOrder = (orderedColumns) => {
    setIsEditing(true);
    setPendingChanges(prev => [
      ...prev.filter(c => c.type !== "SET_COLUMNS_ORDER"),
      { type: "SET_COLUMNS_ORDER", orderedColumns }
    ]);
  };

  // 🔹 Додавання колонки
  const addColumn = async (title = "Нова колонка") => {
    if (isAddingColumn) return;
    setIsAddingColumn(true);
    try {
      await addDoc(collection(db, "columns"), {
        title: title.trim(),
        order: Date.now(),
        createdAt: new Date()
      });
      fetchColumnsWithTasks();
    } catch (err) {
      console.error("Помилка додавання колонки:", err);
    } finally {
      setIsAddingColumn(false);
    }
  };

  // 🔹 Видалення колонки та тасків
  const deleteColumn = async (columnId) => {
    try {
      const q = query(collection(db, "tasks"), where("columnId", "==", columnId));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach(d => batch.delete(doc(db, "tasks", d.id)));
      batch.delete(doc(db, "columns", columnId));

      await batch.commit();
      fetchColumnsWithTasks();
    } catch (err) {
      console.error("Помилка видалення колонки:", err);
    }
  };

  // 🔹 Додавання таску
  const addTask = async (columnId, text) => {
    try {
      await addDoc(collection(db, "tasks"), {
        text: text.trim(),
        columnId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      fetchColumnsWithTasks();
    } catch (err) {
      console.error("Помилка додавання задачі:", err);
    }
  };

  // 🔹 Видалення таску
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      fetchColumnsWithTasks();
    } catch (err) {
      console.error("Помилка видалення задачі:", err);
    }
  };

  // 🔹 Скасування змін
  const cancelChanges = () => {
    setIsEditing(false);
    setPendingChanges([]);
    fetchColumnsWithTasks();
  };

  // 🔹 Збереження змін
  const saveChanges = async () => {
    if (!pendingChanges.length) {
      setIsEditing(false);
      return;
    }

    try {
      const batch = writeBatch(db);

      const setOrder = pendingChanges.find(c => c.type === "SET_COLUMNS_ORDER");
      if (setOrder) {
        setOrder.orderedColumns.forEach(({ id, order }) => {
          batch.update(doc(db, "columns", id), { order });
        });
      }

      pendingChanges
        .filter(c => c.type === "MOVE_TASK")
        .forEach(c => {
          batch.update(doc(db, "tasks", c.taskId), {
            columnId: c.toColumnId,
            updatedAt: new Date()
          });
        });

      await batch.commit();
      setIsEditing(false);
      setPendingChanges([]);
      fetchColumnsWithTasks();
    } catch (err) {
      console.error("Помилка збереження змін:", err);
      alert("Не вдалося зберегти зміни");
    }
  };

  return {
    columnsWithTasks,
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
    fetchColumnsWithTasks
  };
};
