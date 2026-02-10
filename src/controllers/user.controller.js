import User from "../models/User.js";

export const saveTelegramId = async (req, res) => {
  const { userId, telegramId } = req.body;

  // await User.findByIdAndUpdate(userId, {
  //     telegramId: telegramId
  // });
  const user = User.findByIdAndUpdate(
    req.user.id,
    { telegramId },
    { new: true },
  );

  res.json({ message: "Telegram привязан" }, user);
};
