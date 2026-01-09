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

router.post("/buy", async (req, res) => {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course)
        return res.status(404).json({ message: "Not found" });

    if (user.balance < course.price)
        return res.status(400).json({ message: "Not enough balance" });

    if (user.courses.includes(courseId))
        return res.status(400).json({ message: "Already bought" });

    user.balance -= course.price;
    user.courses.push(course._id);
    await user.save();

    res.json({ message: "Course purchased" });
});

export default router;
