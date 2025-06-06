//For registration, login, and logout

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "#db/queries/users";

const router = express.Router();

// POST /users/register
router.post("/register", async (req, res, next) => {
    try {
        console.log("Registration request body:", req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({
                error: "Missing credentials",
                message: "Username and password are required"
            });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 5);

        console.log("Creating user in database...");
        const user = await createUser({
            username,
            password: hashedPassword
        });
        console.log("Created user:", user);

        console.log("Generating token...");
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.send({ token });
    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === "23505") { // PostgreSQL unique violation code
            return res.status(400).send({
                error: "Username taken",
                message: "That username is already taken"
            });
        }
        next(error);
    }
});

// POST /users/login
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({
                error: "Missing credentials",
                message: "Username and password are required"
            });
        }

        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(400).send({
                error: "Invalid credentials",
                message: "Username or password is incorrect"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({
                error: "Invalid credentials",
                message: "Username or password is incorrect"
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.send({ token });
    } catch (error) {
        next(error);
    }
});

export default router;