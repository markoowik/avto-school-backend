import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// получить все курсы
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find({ isActive: true });
        res.json(courses);
    } catch (e) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description,features, price, category } = req.body;

        const course = new Course({
            title,
            description,
            features,
            price,
            category,
        });

        await course.save();

        res.status(201).json(course);
    } catch (e) {
        res.status(500).json({ message: "Ошибка при создании курса" });
    }
});

export default router;
