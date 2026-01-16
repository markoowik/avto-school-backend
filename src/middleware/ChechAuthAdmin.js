import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export const checkAdminAuth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Нет токена" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const admin = await Admin.findById(decoded.id).populate("role");

            if (!admin) {
                return res.status(401).json({ message: "Админ не найден" });
            }

            if (!roles.includes(admin.role.name)) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            req.admin = admin;
            next();
        } catch (e) {
            return res.status(401).json({ message: "Ошибка авторизации" });
        }
    };
};
