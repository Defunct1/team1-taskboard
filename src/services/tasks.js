// src/services/tasks.js
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase/firebase";

// 🔹 Загальне оновлення завдання
export const updateTask = async (taskId, updatedData) => {
  if (!taskId) throw new Error("Невірний taskId");

  try {
    await updateDoc(doc(db, "tasks", taskId), {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Помилка оновлення задачі:", error);
    throw error;
  }
};

// 🔹 Переміщення завдання в інший стовпець
export const moveTask = (taskId, newColumnId) =>
  updateTask(taskId, { columnId: newColumnId });
