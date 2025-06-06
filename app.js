import express from "express";
import { authMiddleware } from './middleware.js';
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(express.json());


// Users routes (public)
app.use("/api/users", usersRouter);

// Tasks routes (protected)
app.use("/api/tasks", authMiddleware, tasksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;