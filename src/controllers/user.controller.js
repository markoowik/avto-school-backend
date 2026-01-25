import User from "../models/User.js";

export const saveTelegramId = async (req, res) => {
    const { userId, telegramId } = req.body;

    await User.findByIdAndUpdate(userId, {
        telegramId: telegramId
    });

    res.json({ message: "Telegram привязан" });
};
