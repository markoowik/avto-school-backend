import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, phone, courseId } = req.body;

        const application = new Application({
            name,
            phone,
            course: courseId,
        });

        await application.save();

        res.status(201).json(application);
    } catch (e) {
        res.status(500).json({ message: "Ошибка при отправке заявки" });
    }
});

export default router;
