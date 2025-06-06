//For creating, reading, updating, and deleting tasks

import express from "express";
import { createTask, getTasks, updateTask, deleteTask, getTaskById } from "#db/queries/tasks";

const router = express.Router();

// POST /tasks - creates a new task owned by the logged-in user
router.post("/", async (req, res, next) => {
    try {
        const { title, done } = req.body;
        
        if (title === undefined || done === undefined) {
            return res.status(400).send({
                error: "Missing fields",
                message: "Title and done status are required"
            });
        }

        const task = await createTask({
            title,
            done,
            userId: req.user.id
        });

        res.send(task);
    } catch (error) {
        next(error);
    }
});

// GET /tasks - sends array of all tasks owned by the logged-in user
router.get("/", async (req, res, next) => {
    try {
        const tasks = await getTasks(req.user.id);
        res.send(tasks);
    } catch (error) {
        next(error);
    }
});

// GET /tasks/:id - gets a specific task owned by the logged-in user
router.get("/:id", async (req, res, next) => {
    try {
        const task = await getTaskById(req.params.id, req.user.id);
        
        if (!task) {
            return res.status(403).send({
                error: "Forbidden",
                message: "You do not have permission to view this task or it doesn't exist"
            });
        }

        res.send(task);
    } catch (error) {
        next(error);
    }
});

// PUT /tasks/:id - updates the specific task owned by the logged-in user
router.put("/:id", async (req, res, next) => {
    try {
        const { title, done } = req.body;
        
        if (title === undefined || done === undefined) {
            return res.status(400).send({
                error: "Missing fields",
                message: "Title and done status are required"
            });
        }

        const task = await updateTask({
            taskId: req.params.id,
            title,
            done,
            userId: req.user.id
        });

        if (!task) {
            return res.status(403).send({
                error: "Forbidden",
                message: "You do not have permission to update this task"
            });
        }

        res.send(task);
    } catch (error) {
        next(error);
    }
});

// DELETE /tasks/:id - deletes the specific task owned by the logged-in user
router.delete("/:id", async (req, res, next) => {
    try {
        const task = await deleteTask(req.params.id, req.user.id);

        if (!task) {
            return res.status(403).send({
                error: "Forbidden",
                message: "You do not have permission to delete this task"
            });
        }

        res.send(task);
    } catch (error) {
        next(error);
    }
});

export default router;