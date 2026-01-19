import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Нет токена" });
        }

        const token = authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: "Токен не найден" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ВАЖНО: decoded ДОЛЖЕН содержать id
        // { id: user._id }

        req.user = {
            id: decoded.id,
        };
        console.log("DECODED:", decoded);

        next();
    } catch (e) {
        return res.status(401).json({ message: "Невалидный токен" });
    }
};

export default authMiddleware;
