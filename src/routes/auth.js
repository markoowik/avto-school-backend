import express from "express";
import User from "./../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { serviceAuth } from "../middleware/serviceAuth.js";
import { saveTelegramId } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // без пароля
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("courses", "title slug"); // req.user приходит из authMiddleware
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
    console.log("USER FROM DB:", user); // 👈 СМОТРИ СЮДА

    // Вот сюда вставляем
    res.json({
      _id: user._id,
      username: user.username,
      surname: user.surname, // имя и фамилия остаются
      email: user.email,
      role: user.role, // добавляем
      balance: user.balance,
      courses: user.courses,
      createdAt: user.createdAt,
    });
    console.log("REQ.USER:", req.user);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, surname, email, password } = req.body;

    const emailNormalized = email.toLowerCase().trim();

    const candidate = await User.findOne({ email: emailNormalized });
    if (candidate) {
      return res.status(400).json({
        message: "Пользователь с таким email уже существует",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      surname,
      email: emailNormalized,
      password: hash,
      role: "student",
    });

    await user.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // 🔥 ВАЖНО: обработка duplicate key
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email уже используется",
      });
    }

    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
    { expiresIn: "7d" },
  );
  res.json({ token });
});

router.post("/bind-telegram", saveTelegramId, serviceAuth);

router.get("/by-telegram/:telegramId", async (req, res) => {
  const user = await User.findOne({
    telegramId: req.params.telegramId,
  }).populate("courses", "title slug");

  if (!user) {
    return res.status(404).json({ courses: [] });
  }

  res.json({ courses: user.courses });
});

export default router;
