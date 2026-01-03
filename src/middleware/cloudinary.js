import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg;
import multer from 'multer';

// Настройка Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Настройка хранилища
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'my-folder', // Папка для загрузок
        allowed_formats: ['jpg', 'png', 'jpeg'] // Разрешенные форматы
    }
});

// Экспорт multer парсера
export const parser = multer({ storage });
