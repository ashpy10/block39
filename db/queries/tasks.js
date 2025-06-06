import db from '#db/client';

export async function createTask({ title, userId, done = false }) {
    const { rows: [task] } = await db.query(
        `INSERT INTO tasks (title, user_id, done)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [title, userId, done]
    );
    return task;
}

export async function getTasks(userId) {
    const { rows } = await db.query(
        `SELECT * FROM tasks
        WHERE user_id = $1
        ORDER BY id ASC`,
        [userId]
    );
    return rows;
}

export async function getTaskById(taskId, userId) {
    const { rows: [task] } = await db.query(
        `SELECT * FROM tasks
        WHERE id = $1 AND user_id = $2`,
        [taskId, userId]
    );
    return task;
}

export async function updateTask({ taskId, title, done, userId }) {
    const { rows: [task] } = await db.query(
        `UPDATE tasks
        SET title = $1, done = $2
        WHERE id = $3 AND user_id = $4
        RETURNING *`,
        [title, done, taskId, userId]
    );
    return task;
}

export async function deleteTask(taskId, userId) {
    const { rows: [task] } = await db.query(
        `DELETE FROM tasks
        WHERE id = $1 AND user_id = $2
        RETURNING *`,
        [taskId, userId]
    );
    return task;
} 