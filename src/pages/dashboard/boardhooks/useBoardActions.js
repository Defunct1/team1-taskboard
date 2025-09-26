//Більше не використовується, видалити. Пряцюємо напряму з Redux

// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import {
//   collection,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   writeBatch,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../../utils/firebase/firebase";
// import { toast } from "react-toastify";

// export const useBoardActions = () => {
//   const [columnsWithTasks, setColumnsWithTasks] = useState([]);
//   const [isAddingColumn, setIsAddingColumn] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [pendingChanges, setPendingChanges] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isEditing) {
//       console.log("Pausing onSnapshot: isEditing is true");
//       return;
//     }

//     console.log("Subscribing to Firestore onSnapshot");
//     const colRef = collection(db, "columns");
//     const colQuery = query(colRef, orderBy("order", "asc"));

//     const unsubscribeColumns = onSnapshot(
//       colQuery,
//       (colSnapshot) => {
//         const cols = colSnapshot.docs.map((colDoc) => ({
//           id: String(colDoc.id),
//           ...colDoc.data(),
//           tasks: [],
//         }));

//         const tasksRef = collection(db, "tasks");
//         const unsubscribeTasks = onSnapshot(tasksRef, (taskSnapshot) => {
//           const allTasks = taskSnapshot.docs.map((t) => ({
//             id: String(t.id),
//             ...t.data(),
//             columnId: String(t.data().columnId),
//           }));

//           const merged = cols.map((col) => ({
//             ...col,
//             tasks: allTasks
//               .filter((t) => String(t.columnId) === String(col.id))
//               .sort((a, b) => (a.order || 0) - (b.order || 0)),
//           }));

//           console.log("onSnapshot updated columnsWithTasks:", merged);
//           setColumnsWithTasks(merged);
//           setLoading(false);
//         }, (err) => {
//           console.error("Помилка підписки на задачі:", err);
//           toast.error("Не вдалося завантажити задачі");
//           setLoading(false);
//         });

//         return () => {
//           console.log("Unsubscribing from tasks onSnapshot");
//           unsubscribeTasks();
//         };
//       },
//       (err) => {
//         console.error("Помилка підписки на колонки:", err);
//         toast.error("Не вдалося завантажити дані колонок");
//         setLoading(false);
//       }
//     );

//     return () => {
//       console.log("Unsubscribing from columns onSnapshot");
//       unsubscribeColumns();
//     };
//   }, [isEditing]);

//   const moveTaskLocally = (taskId, fromColumnId, toColumnId, newIndex = null) => {
//     setIsEditing(true);

//     setColumnsWithTasks((prev) => {
//       const updated = [...prev];
//       const fromCol = updated.find((c) => String(c.id) === String(fromColumnId));
//       const toCol = updated.find((c) => String(c.id) === String(toColumnId));
//       if (!fromCol || !toCol) {
//         console.error("Column not found:", {
//           fromColumnId,
//           toColumnId,
//           columns: updated.map((c) => ({ id: c.id, title: c.title })),
//         });
//         return prev;
//       }

//       const taskIndex = fromCol.tasks.findIndex((t) => String(t.id) === String(taskId));
//       if (taskIndex === -1) {
//         console.error("Task not found:", {
//           taskId,
//           fromColumnId,
//           tasks: fromCol.tasks.map((t) => ({ id: t.id, text: t.text, columnId: t.columnId })),
//           allTasks: updated.flatMap((c) => c.tasks.map((t) => ({ id: t.id, text: t.text, columnId: t.columnId }))),
//         });
//         return prev;
//       }

//       const [movedTask] = fromCol.tasks.splice(taskIndex, 1);
//       const updatedTask = { ...movedTask, columnId: String(toColumnId), isPending: true };

//       if (newIndex !== null) {
//         toCol.tasks.splice(newIndex, 0, updatedTask);
//       } else {
//         toCol.tasks.push(updatedTask);
//       }

//       toCol.tasks = toCol.tasks.map((task, idx) => ({ ...task, order: idx }));
//       fromCol.tasks = fromCol.tasks.map((task, idx) => ({ ...task, order: idx }));

//       console.log("moveTaskLocally updated columns:", {
//         updated,
//         movedTask,
//         fromColId: fromColumnId,
//         toColId: toColumnId,
//         newIndex,
//       });
//       return updated;
//     });

//     setPendingChanges((prev) => {
//       const newChanges = [
//         ...prev.filter((c) => !(c.type === "MOVE_TASK" && String(c.taskId) === String(taskId))),
//         { type: "MOVE_TASK", taskId, fromColumnId, toColumnId, newIndex },
//       ];
//       console.log("Pending changes updated:", newChanges);
//       return newChanges;
//     });
//   };

//   const queueColumnsOrder = (orderedColumns) => {
//     setIsEditing(true);
//     setColumnsWithTasks((prev) => {
//       const updated = orderedColumns.map((col, idx) => ({
//         ...prev.find((c) => String(c.id) === String(col.id)) || col,
//         order: idx,
//       }));
//       console.log("queueColumnsOrder updated columns:", updated);
//       return updated;
//     });
//     setPendingChanges((prev) => {
//       const newChanges = [
//         ...prev.filter((c) => c.type !== "SET_COLUMNS_ORDER"),
//         { type: "SET_COLUMNS_ORDER", orderedColumns },
//       ];
//       console.log("queueColumnsOrder updated pendingChanges:", newChanges);
//       return newChanges;
//     });
//   };

//   const addColumn = async (title = "Нова колонка") => {
//     if (!title.trim()) {
//       toast.error("Будь ласка, введіть назву колонки");
//       return null;
//     }
//     if (isAddingColumn) {
//       console.log("addColumn: Already adding a column");
//       return null;
//     }
//     setIsAddingColumn(true);
//     setIsEditing(false); // Ensure no pending changes
//     try {
//       const docRef = await addDoc(collection(db, "columns"), {
//         title: title.trim(),
//         order: columnsWithTasks.length,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//       const newColumn = {
//         id: String(docRef.id),
//         title: title.trim(),
//         order: columnsWithTasks.length,
//         tasks: [],
//         createdAt: new Date(),
//       };
//       setColumnsWithTasks((prev) => [...prev, newColumn]);
//       console.log("addColumn: Added column:", newColumn);
//       return newColumn;
//     } catch (err) {
//       console.error("Помилка додавання колонки:", err);
//       toast.error("Не вдалося додати колонку");
//       throw err;
//     } finally {
//       setIsAddingColumn(false);
//     }
//   };

//   const deleteColumn = async (columnId) => {
//     try {
//       const q = query(collection(db, "tasks"), where("columnId", "==", columnId));
//       const snapshot = await getDocs(q);
//       const batch = writeBatch(db);

//       snapshot.docs.forEach((d) => batch.delete(doc(db, "tasks", String(d.id))));
//       batch.delete(doc(db, "columns", String(columnId)));

//       await batch.commit();
//       setColumnsWithTasks((prev) => prev.filter((c) => String(c.id) !== String(columnId)));
//       setIsEditing(false);
//     } catch (err) {
//       console.error("Помилка видалення колонки:", err);
//       toast.error("Не вдалося видалити колонку");
//       throw err;
//     }
//   };

//   const addTask = async (columnId, taskData) => {
//     if (typeof taskData.text !== "string") {
//       throw new Error("Task text must be a string");
//     }
//     try {
//       const docRef = await addDoc(collection(db, "tasks"), {
//         text: taskData.text.trim(),
//         columnId: String(columnId),
//         order: taskData.order || Date.now(),
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         description: taskData.description || "",
//         labels: taskData.labels || [],
//         comments: taskData.comments || [],
//         dueDate: taskData.dueDate || null,
//         status: taskData.status || "todo",
//       });
//       setIsEditing(false);
//       return String(docRef.id);
//     } catch (err) {
//       console.error("Помилка додавання задачі:", err);
//       toast.error("Не вдалося додати задачу");
//       throw err;
//     }
//   };

//   const saveTask = async (task) => {
//     try {
//       await updateDoc(doc(db, "tasks", String(task.id)), {
//         text: task.text.trim(),
//         description: task.description || "",
//         labels: task.labels || [],
//         comments: task.comments || [],
//         dueDate: task.dueDate || null,
//         status: task.status || "todo",
//         columnId: String(task.columnId),
//         order: task.order || 0,
//         updatedAt: serverTimestamp(),
//       });
//       setIsEditing(false);
//     } catch (err) {
//       console.error("Помилка збереження задачі:", err);
//       toast.error("Не вдалося зберегти задачу");
//       throw err;
//     }
//   };

//   const deleteTask = async (taskId) => {
//     try {
//       await deleteDoc(doc(db, "tasks", String(taskId)));
//       setIsEditing(false);
//     } catch (err) {
//       console.error("Помилка видалення задачі:", err);
//       toast.error("Не вдалося видалити задачу");
//       throw err;
//     }
//   };

//   const cancelChanges = () => {
//     setIsEditing(false);
//     setPendingChanges([]);
//     console.log("cancelChanges called: Cleared pending changes");
//     setColumnsWithTasks([]); // Trigger re-fetch
//     setLoading(true);
//   };

//   // useBoardActions.js - виправлена функція saveChanges

// const saveChanges = async () => {
//   if (!pendingChanges.length) {
//     setIsEditing(false);
//     return;
//   }

//   try {
//     const batch = writeBatch(db);

//     for (const change of pendingChanges) {
//       if (change.type === "MOVE_TASK") {
//         // ✅ ПЕРЕВІРКА: чи існує цільова колонка
//         const toCol = columnsWithTasks.find(col => col.id === change.toColumnId);
//         if (!toCol) {
//           console.warn("Target column not found:", change.toColumnId);
//           continue; // пропускаємо цю зміну
//         }

//         // ✅ Оновлюємо порядок всіх задач у цільовій колонці
//         toCol.tasks.forEach((task, idx) => {
//           batch.update(doc(db, "tasks", task.id), {
//             columnId: toCol.id,
//             order: idx,
//             updatedAt: serverTimestamp()
//           });
//         });
//       }
//     }

//     await batch.commit();
//     setIsEditing(false);
//     setPendingChanges([]);
//   } catch (err) {
//     console.error("Помилка збереження змін:", err);
//     throw err;
//   }
// };

//   return {
//     columnsWithTasks,
//     isAddingColumn,
//     isEditing,
//     pendingChanges,
//     loading,
//     addColumn,
//     deleteColumn,
//     addTask,
//     saveTask,
//     deleteTask,
//     moveTaskLocally,
//     queueColumnsOrder,
//     cancelChanges,
//     saveChanges,
//   };
// };

// useBoardActions.addTask = PropTypes.shape({
//   columnId: PropTypes.string.isRequired,
//   taskData: PropTypes.shape({
//     text: PropTypes.string.isRequired,
//     description: PropTypes.string,
//     labels: PropTypes.array,
//     comments: PropTypes.array,
//     dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     status: PropTypes.string,
//     createdAt: PropTypes.string,
//     updatedAt: PropTypes.string,
//     order: PropTypes.number,
//   }).isRequired,
// });

// useBoardActions.saveTask = PropTypes.shape({
//   task: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     text: PropTypes.string.isRequired,
//     description: PropTypes.string,
//     labels: PropTypes.array,
//     comments: PropTypes.array,
//     dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     status: PropTypes.string,
//     columnId: PropTypes.string.isRequired,
//     order: PropTypes.number,
//     updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//   }).isRequired,
// });