// routes/admin.js
import express from "express";

import User from "../models/User.js";
import {Admin} from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminOnly.js";
import {checkAdminAuth} from "../middleware/ChechAuthAdmin.js"
import { Role } from "../models/Role.js";

const router = express.Router();


router.get("/me", authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id); // req.user приходит из authMiddleware
        if (!admin) return res.status(404).json({ message: "Пользователь не найден" });

        // Вот сюда вставляем
        res.json({
            _id: admin._id,
            name: admin.name,
            role: admin.role,
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});



router.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        const admin = await Admin.findOne({ name }).populate("role");
        if (!admin) {
            return res.status(401).json({ message: "Неверный логин или пароль" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный логин или пароль" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                role: admin.role.name,
            },
        });
    } catch (e) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
router.post("/create-first-admin", async (req, res) => {
    try {
        const { name, password } = req.body;

        // 1. Проверка
        const exists = await Admin.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Админ уже существует" });
        }

        // 2. Берём роль admin
        const adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) {
            return res.status(500).json({ message: "Роль admin не найдена" });
        }

        // 3. Хешируем пароль
        const hash = await bcrypt.hash(password, 10);

        // 4. Создаём админа
        const admin = new Admin({
            name,
            password: hash,
            role: adminRole._id,
        });

        await admin.save();

        res.json({ message: "Админ создан" });
    } catch (e) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post("/create-user", checkAdminAuth(["admin"]), adminOnly, async (req, res) => {
    const { email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashed,
        role, // admin | student
    });

    res.json(user);
});
router.post("/add-balance", async (req, res) => {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amount;
    await user.save();

    res.json({ message: "Balance updated", balance: user.balance });
});

export default router;
