import express from 'express';
import News from '../models/News.js';
import {upload} from '../middleware/upload.js';
import {checkAdminAuth} from "../middleware/ChechAuthAdmin.js";
import authAdminMiddleware from "../middleware/authAdminMiddleware.js";

const router = express.Router();

// GET: получить все новости
router.get('/', async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (err) {
        console.error('Error fetching news:', err);
        res.status(500).json({
            message: 'Ошибка при получении новостей',
            error: err.message
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: "Новость не найдена" });
        }

        res.json(news);
    } catch (e) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
// POST: создать новость
router.post(
    "/addnews",
    authAdminMiddleware(["admin"]),
    upload.single("image"),
    async (req, res) => {
        try {
            const { title, description } = req.body;

            const news = await News.create({
                title,
                description,
            });

            res.status(201).json(news);
        } catch (error) {
            console.error("ADD NEWS ERROR:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);



export default router;
