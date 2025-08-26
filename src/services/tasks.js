import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../utils/firebase/firebase"; // Виправлено шлях

// Функція для оновлення завдання
export const updateTask = async (taskId, updatedData) => {
    try {
        await updateDoc(doc(db, 'tasks', taskId), {
            ...updatedData,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Помилка оновлення задачі', error);
        throw error; // Прокинути помилку для обробки на рівні виклику
    }
};

// Функція для переміщення завдання між стовпцями
export const moveTask = async (taskId, newColumnId) => {
    try {
        await updateDoc(doc(db, 'tasks', taskId), {
            columnId: newColumnId,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Помилка переміщення задачі:', error);
        throw error; // Прокинути помилку для обробки на рівні виклику
    }
};

export const moveTaskToColumn = async (taskId, newColumnId) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        columnId: newColumnId,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Помилка переміщення задачі:', error);
      throw error;
    }
};