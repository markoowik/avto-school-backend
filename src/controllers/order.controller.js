import Order from "../models/Order.js";

export const confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Заказ не найден" });
        }

        order.status = "paid";
        await order.save();

        res.json({ message: "Оплата подтверждена" });
    } catch (e) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id,
            status: "paid", // 👈 ТОЛЬКО ОПЛАЧЕННЫЕ
        }).populate("courseId");

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};