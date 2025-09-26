import { createSlice } from "@reduxjs/toolkit";
import {
  subscribeToColumnsAndTasks,
  createColumn,
  createTask,
  deleteColumnWithTasks,
  updateTaskDoc,
  deleteTaskDoc,
  batchUpdateTaskOrders,
  setColumnsOrderInFirestore,
} from "../services/firebaseService";
import { reorderColumns } from "../utils/board/reorderColumns";

let boardUnsubscribe = null;

// ✅ ВИПРАВЛЕНО: Перетворюємо на строки замість Date об'єктів
const normalizeColumn = (col) => ({
  ...col,
  // Перетворюємо Timestamp на ISO строки
  createdAt: col.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  updatedAt: col.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  tasks: (col.tasks || []).map((task) => ({
    ...task,
    // ✅ Перетворюємо дати задач на строки
    createdAt: task.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: task.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    dueDate: task.dueDate?.toDate?.()?.toISOString() || task.dueDate,
  })),
});

const initialState = {
  columns: [],
  loading: true,
  error: null,
  isAddingColumn: false,
  isEditing: false,
  pendingChanges: [],
};

const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setColumns(state, action) {
      state.columns = (action.payload || []).map(normalizeColumn);
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setIsAddingColumn(state, action) {
      state.isAddingColumn = action.payload;
    },
    setIsEditing(state, action) {
      state.isEditing = action.payload;
    },
    addPendingChange(state, action) {
      state.pendingChanges = [
        ...state.pendingChanges.filter(
          (c) =>
            !(
              c.type === action.payload.type &&
              c.taskId &&
              action.payload.taskId &&
              String(c.taskId) === String(action.payload.taskId)
            )
        ),
        action.payload,
      ];
    },
    clearPendingChanges(state) {
      state.pendingChanges = [];
    },
    reorderColumnsAction(state, action) {
      const { sourceIndex, destinationIndex } = action.payload;
      const reordered = reorderColumns(state.columns, sourceIndex, destinationIndex);
      state.columns = reordered.map(normalizeColumn);
    },
    addColumnAction(state, action) {
      state.columns.push(normalizeColumn({ ...action.payload }));
    },
    applyLocalMove(state, action) {
      const { taskId, fromColumnId, toColumnId, newIndex } = action.payload;
      const cols = state.columns.map(normalizeColumn);

      const fromIdx = cols.findIndex((c) => String(c.id) === String(fromColumnId));
      const toIdx = cols.findIndex((c) => String(c.id) === String(toColumnId));
      if (fromIdx === -1 || toIdx === -1) return;

      const taskIndex = cols[fromIdx].tasks.findIndex((t) => String(t.id) === String(taskId));
      const [moved] = cols[fromIdx].tasks.splice(taskIndex, 1);
      if (!moved) return;

      // ✅ ВИПРАВЛЕНО: Використовуємо строку замість Date
      const updatedTask = { 
        ...moved, 
        columnId: String(toColumnId), 
        isPending: true, 
        updatedAt: new Date().toISOString() // ← Тут виправлено
      };

      if (newIndex != null) cols[toIdx].tasks.splice(newIndex, 0, updatedTask);
      else cols[toIdx].tasks.push(updatedTask);

      cols[toIdx].tasks = cols[toIdx].tasks.map((t, i) => ({ ...t, order: i }));
      cols[fromIdx].tasks = cols[fromIdx].tasks.map((t, i) => ({ ...t, order: i }));

      state.columns = cols;
      state.isEditing = true;
    },
    setColumnsOrderLocal(state, action) {
      const ordered = action.payload;
      state.columns = ordered.map((o) => ({
        ...(state.columns.find((c) => String(c.id) === String(o.id)) || {}),
        order: o.order,
      }));
      state.pendingChanges = [
        ...state.pendingChanges.filter((c) => c.type !== "SET_COLUMNS_ORDER"),
        { type: "SET_COLUMNS_ORDER", orderedColumns: ordered },
      ];
      state.isEditing = true;
    },
  },
});

export const {
  setColumns,
  setLoading,
  setError,
  setIsAddingColumn,
  setIsEditing,
  addPendingChange,
  clearPendingChanges,
  applyLocalMove,
  setColumnsOrderLocal,
  reorderColumnsAction,
  addColumnAction,
} = slice.actions;

export default slice.reducer;

/* THUNKS */

export const startBoardSync = () => (dispatch, getState) => {
  if (boardUnsubscribe) return;
  if (getState().board.isEditing) return;

  dispatch(setLoading(true));

  boardUnsubscribe = subscribeToColumnsAndTasks(
    (merged) => {
      if (getState().board.isEditing) return;
      const normalizedColumns = merged.map(normalizeColumn);
      dispatch(setColumns(normalizedColumns));
    },
    (err) => {
      console.error("subscribe error", err);
      dispatch(setError(err?.message || "Listen error"));
    }
  );
};

export const stopBoardSync = () => (dispatch) => {
  if (boardUnsubscribe) {
    boardUnsubscribe();
    boardUnsubscribe = null;
    dispatch(setLoading(false));
  }
};

export const moveTaskOptimistic = ({ taskId, fromColumnId, toColumnId, newIndex }) => (dispatch, getState) => {
  dispatch(applyLocalMove({ taskId, fromColumnId, toColumnId, newIndex }));
  dispatch(addPendingChange({ type: "MOVE_TASK", taskId, fromColumnId, toColumnId, newIndex }));

  console.log("Pending changes:", getState().board.pendingChanges);

  dispatch(stopBoardSync());
};

export const queueColumnsOrder = (orderedColumns) => (dispatch) => {
  dispatch(setColumnsOrderLocal(orderedColumns));
  dispatch(stopBoardSync());
};

export const saveChanges = () => async (dispatch, getState) => {
  const { pendingChanges, columns } = getState().board;
  if (!pendingChanges.length) {
    dispatch(setIsEditing(false));
    dispatch(startBoardSync());
    return;
  }

  try {
    for (const change of pendingChanges) {
      if (change.type === "SET_COLUMNS_ORDER") {
        await setColumnsOrderInFirestore(change.orderedColumns);
      }
    }

    const updates = [];
    for (const change of pendingChanges) {
      if (change.type === "MOVE_TASK") {
        const toCol = columns.find((c) => String(c.id) === String(change.toColumnId));
        if (!toCol) continue;
        toCol.tasks.forEach((task, idx) => {
          updates.push({ id: task.id, columnId: toCol.id, order: idx });
        });
      }
    }

    if (updates.length) await batchUpdateTaskOrders(updates);

    dispatch(clearPendingChanges());
    dispatch(setIsEditing(false));
    dispatch(startBoardSync());
  } catch (err) {
    console.error("saveChanges failed", err);
    dispatch(setError(err?.message || "Save failed"));
    throw err;
  }
};

export const cancelChanges = () => (dispatch) => {
  dispatch(clearPendingChanges());
  dispatch(setIsEditing(false));
  dispatch(startBoardSync());
};

// CRUD Thunks
export const addColumn = (title) => async (dispatch, getState) => {
  if (!title || typeof title !== "string" || !title.trim()) throw new Error("Назва колонки порожня або не є рядком");

  dispatch(setIsAddingColumn(true));
  try {
    const order = getState().board.columns.length;
    const newColumn = await createColumn(title.trim(), order);
    const normalizedColumn = normalizeColumn(newColumn);
    dispatch(setIsAddingColumn(false));
    return normalizedColumn;
  } catch (err) {
    dispatch(setIsAddingColumn(false));
    console.error("Помилка додавання колонки:", err);
    throw err;
  }
};

export const addTask = (columnId, taskData) => async (dispatch) => {
  try {
    // ✅ Перетворюємо дати на строки перед відправкою в Firebase
    const taskDataWithStringDates = {
      ...taskData,
      createdAt: taskData.createdAt instanceof Date ? taskData.createdAt.toISOString() : taskData.createdAt,
      updatedAt: taskData.updatedAt instanceof Date ? taskData.updatedAt.toISOString() : taskData.updatedAt,
      dueDate: taskData.dueDate instanceof Date ? taskData.dueDate.toISOString() : taskData.dueDate,
    };
    
    const id = await createTask(columnId, taskDataWithStringDates);
    return id;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const saveTask = (task) => async (dispatch) => {
  try {
    // ✅ Перетворюємо дати на строки перед збереженням
    const taskWithStringDates = {
      ...task,
      createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : task.createdAt,
      updatedAt: task.updatedAt instanceof Date ? task.updatedAt.toISOString() : task.updatedAt,
      dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
    };
    
    await updateTaskDoc(taskWithStringDates);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    await deleteTaskDoc(taskId);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteColumn = (columnId) => async (dispatch) => {
  try {
    await deleteColumnWithTasks(columnId);
  } catch (err) {
    console.error(err);
    throw err;
  }
};