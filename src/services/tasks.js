import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../utils/firebase/firebase";

// 🔹 Загальне оновлення завдання
export const updateTask = async (taskId, updatedData) => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), {
      ...updatedData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Помилка оновлення задачі:', error);
    throw error;
  }
};

// 🔹 Переміщення завдання в інший стовпець
export const moveTask = async (taskId, newColumnId) => {
  try {
    await updateTask(taskId, { columnId: newColumnId });
  } catch (error) {
    console.error('Помилка переміщення задачі:', error);
    throw error;
  }
};
