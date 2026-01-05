import express from 'express';
import News from '../models/News.js';
import {upload} from '../middleware/upload.js';

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

// POST: создать новость
router.post("/addnews", upload.single("image"), async (req, res) => {
        try {
            const { title, description } = req.body;

            const image = req.file ? req.file.path : null;

            const news = await News.create({
                title,
                description,
                image,
            });

            res.status(201).json(news);
        } catch (error) {
            console.error("ADD NEWS ERROR:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);


export default router;
