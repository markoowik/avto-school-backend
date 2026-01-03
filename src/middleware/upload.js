import multer from "multer";
import { parser } from "./cloudinary.js";

export const upload = multer({
    storage: parser,
});
