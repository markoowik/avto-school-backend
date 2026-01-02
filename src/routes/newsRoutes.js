import express from 'express';
import News from "../models/News.js";

const router = express.Router();

router.post("/addnews", async (req, res) => {
    try{
        const { title, description, image } = req.body;

        const news = new News({ title, description, image });

        await news.save()
        res.status(201).json(news);
    } catch(err){
        res.status(500).json({ message: "Ошибка при создании новости" });
    }
})

export default router;