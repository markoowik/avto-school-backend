export const adminOnly = (req, res, next) => {
    if (user.role.name !== "admin") {
        return res.status(403).json({ message: "Нет доступа" });
    }
    next();
};