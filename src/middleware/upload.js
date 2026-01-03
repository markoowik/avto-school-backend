import multer from "multer";
import path from "path";

// Настройка хранилища
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // папка на сервере
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Фильтр по типу файла (необязательно)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Только изображения jpg, jpeg, png"), false);
    }
};

const parser = multer({ storage, fileFilter });

export default parser;
