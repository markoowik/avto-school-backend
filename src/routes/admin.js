// routes/admin.js
import express from "express";

import User from "../models/User.js";
import {Admin} from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

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

router.post("/register", async (req, res) => {
    const { name, password, role} = req.body;

    const candidate = await Admin.findOne({name});

    if(candidate) return res.status(400).json({message: "Администратор с таким никнейм уже есть!"});

    const hash = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({name, password: hash, role: "admin"});

    await admin.save();
    res.json({message: "Вы успешно создали админ-аккаунт!"})
})

router.post("/login", async (req, res) => {
    const { name, password } = req.body;

    const adminUser = await Admin.findOne({name});
    if(!adminUser) return res.status(400).json({message: "С таким никнейм уже есть!"});

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) res.status(400).json({message: "Неправильный пароль"});

    const token = jwt.sign({id: adminUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({token: token});

})

router.post("/add-balance", async (req, res) => {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amount;
    await user.save();

    res.json({ message: "Balance updated", balance: user.balance });
});

export default router;
