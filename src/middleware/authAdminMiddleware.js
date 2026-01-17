import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

// middleware для проверки роли
export function authAdminMiddleware(requiredRole) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers?.authorization;
            if (!authHeader) return res.status(401).json({ message: "Нет токена" });

            const token = authHeader.split(" ")[1];
            if (!token) return res.status(401).json({ message: "Нет токена" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await Admin.findById(decoded.id).populate("role");
            if (!admin) return res.status(401).json({ message: "Админ не найден" });

            req.admin = { id: admin._id, role: admin.role?.name || "admin" };

            // проверка роли
            if (requiredRole && req.admin.role !== requiredRole) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            next();
        } catch (err) {
            console.error("authAdminMiddleware error:", err);
            res.status(401).json({ message: "Не авторизован" });
        }
    };
}
