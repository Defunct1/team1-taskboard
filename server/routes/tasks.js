// routes/tasks.js
import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();
router.get("/", getTasks);
router.post("/", createTask);
router.put('/:id', updateTask);       // оновити задачу
router.delete('/:id', deleteTask);    // видалити задачу

export default router;
