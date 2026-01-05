import cloudinary from "cloudinary";

import CloudinaryStorage  from "multer-storage-cloudinary";

const { v2 } = cloudinary;

import multer from "multer";

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "news",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

export const upload = multer({ storage });
