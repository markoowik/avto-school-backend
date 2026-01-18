import express from 'express';
import User from "./../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/me", authMiddleware(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // req.user приходит из authMiddleware
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        // Вот сюда вставляем
        res.json({
            _id: user._id,
            username: user.username,
            surname: user.surname, // теперь отправляем фамилию
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post("/register", async (req, res) => {
    const {username, surname, email, password} = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) return res.status(400).json({ message: "Пользователь с таким email уже существует"});

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, surname, email, password: hash, role: "student" });

    await user.save();
    res.json({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.json({ token });
});



export default router;