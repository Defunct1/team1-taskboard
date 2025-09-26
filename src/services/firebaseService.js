import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
    query,
    orderBy,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../utils/firebase/firebase";

/** 
 * Підписка яка повертає unsubscribe()
 * onUpdate(mergedColumnsWithTasks)
 * onError(err)
*/

export function subscribeToColumnsAndTasks(onUpdate, onError) {
    const colRef = collection(db, "columns");
    const colQuery = query(colRef, orderBy("order", "asc"));

    let unsubscribeTasks = null;

    const unsubscribeCols = onSnapshot(
        colQuery,
        (colSnapshot) => {
            const cols = colSnapshot.docs.map((d) => ({
                id: String(d.id),
                ...d.data(),
                tasks: [],
            }));

            //підписуємось на tasks (щоб мати актуальний список)
            const taskRef = collection(db, "tasks");
            if (unsubscribeTasks) unsubscribeTasks();
            unsubscribeTasks = onSnapshot(
                taskRef,
                (taskSnapshot) => {
                    const allTasks = taskSnapshot.docs.map((t) => ({
                        id: String(t.id),
                        ...t.data(),
                        columnId: String(t.data().columnId)
                    }));
                    //об'єднуємо колонки з тасками
                    const merged = cols.map((col) => ({
                        ...col,
                        tasks: allTasks
                            .filter((t) => t.columnId === String(col.id))
                            .sort((a, b) => (a.order || 0) - (b.order || 0)),
                    }));
                    onUpdate(merged);
                },
                (err) => onError && onError(err)
            );
        },
        (err) => onError && onError(err)
    );
    return () => {
        if (unsubscribeTasks) unsubscribeTasks();
        unsubscribeCols();
    };         
}

// створити колонку
export const createColumn = async (title, order = 0) => {
    const docRef = await addDoc(collection(db, "columns"), {
      title: title.trim(),
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, title, order };
};

// видалити колонку разом із задачами
export const deleteColumnWithTasks = async (columnId) => {
    const q = query(collection(db, "tasks"), where("columnId", "==", columnId));
    const snapshot = await getDocs(q);
  
    const batch = writeBatch(db);
    snapshot.docs.forEach((taskDoc) => {
      batch.delete(doc(db, "tasks", taskDoc.id));
    });
  
    batch.delete(doc(db, "columns", columnId));
    await batch.commit();
};

export async function createTask (columnId, taskData) {
    const docRef = await addDoc(collection(db, "tasks"), {
        text:taskData.text.trim(),
        columnId: String(columnId),
        order: taskData.order && Date.now(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        description: taskData.description || "",
        labels: taskData.labels || [],
        comments: taskData.comments || [],
        dueDate: taskData.dueDate || null,
        status: taskData.status || "todo",
    });
    return String(docRef.id);
}


export async function updateTaskDoc(task) {
    await updateDoc(doc(db, "tasks", String(task.id)), {
        text: task.text.trim(),
        description: task.description || "",
        labels: task.labels || [],
        comments: task.comments || [],
        dueDate: task.dueDate || null,
        status: task.status || "todo",
        columnId: String(task.columnId),
        order: task.order ?? 0,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteTaskDoc(taskId) {
    await deleteDoc(doc(db, "tasks", String(taskId)));
}

export async function batchUpdateTaskOrders(updates /* [{id, columnId, order}] */) {
    if (!updates.length) return;
    const batch = writeBatch(db);
    updates.forEach((u) => {
      batch.update(doc(db, "tasks", String(u.id)), {
        columnId: String(u.columnId),
        order: u.order,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
}

export async function setColumnsOrderInFirestore(orderedColumns /* [{id, order}] */) {
    if (!orderedColumns || !orderedColumns.length) return;
    const batch = writeBatch(db);
    orderedColumns.forEach((c) => {
      batch.update(doc(db, "columns", String(c.id)), { order: c.order, updatedAt: serverTimestamp() });
    });
    await batch.commit();
}