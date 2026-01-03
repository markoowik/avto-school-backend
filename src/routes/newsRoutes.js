import express from 'express';
import News from "../models/News.js";
import {upload} from "../middleware/upload.js";


const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении новостей" });
    }
});
router.post("/addnews", upload.single("image"),  async (req, res) => {
    try{
        const { title, description } = req.body;

        const image = req.file ? req.file.path : "";

        const news = new News({ title, description, image });

        await news.save()
        res.status(201).json(news);
    } catch(err){
        res.status(500).json({ message: "Ошибка при создании новости" });
    }
})

export default router;