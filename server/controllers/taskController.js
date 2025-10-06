// taskController.js
import pool from '../db/pool.js';

// =======================
// Отримати всі задачі
// =======================

export const getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Помилка при отриманні задач:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// =======================
// Створити нову задачу
// =======================

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Поле "title" є обовʼязковим' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', status || 'todo']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Помилка при створенні задачі:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// =======================
// Оновити задачу (наприклад статус)
// =======================

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    //перевірка чи задача існує
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не знайдена' });
    }
  


    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [title, description, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
  console.error('Помилка при оновленні задачі:', error);
  res.status(500).json({ error: 'Server error' });
  }
};

// =======================
// Видалити задачу
// =======================

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Перевірка, чи існує задача
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не знайдена' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Задача видалена успішно' });
  } catch (error) {
    console.error('Помилка при видаленні задачі:', error);
    res.status(500).json({ error: 'Server error' });
  }
};