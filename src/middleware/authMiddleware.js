import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = () => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Нет токена" });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // @ts-ignore
            req.user = decoded; // id + role

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "Пользователь не найден" });

            next();
        } catch (err) {
            console.error("AUTH ERROR:", err);
            return res.status(401).json({ message: "Неверный токен" });
        }
    };
};
