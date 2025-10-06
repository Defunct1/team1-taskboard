import express from 'express'
import pool from './db/pool.js';
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = 5002;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Tasks backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error(err);
  else console.log("DB connected at", res.rows[0].now);
});

app.use("/api/tasks", taskRoutes);