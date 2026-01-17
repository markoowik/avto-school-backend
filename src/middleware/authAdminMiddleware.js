import jwt from "jsonwebtoken";

export const authAdminMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Нет токена" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // { id, role: "admin" }
        next();
    } catch (e) {
        return res.status(401).json({ message: "Неверный токен" });
    }
};
