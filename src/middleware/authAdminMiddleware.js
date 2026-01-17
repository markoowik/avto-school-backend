import jwt from "jsonwebtoken";

const authAdminMiddleware = (roles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Нет токена" });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Нет токена" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            req.admin = decoded;
            next();
        } catch (e) {
            return res.status(401).json({ message: "Неверный токен" });
        }
    };
};

export default authAdminMiddleware;
