import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Нет доступа" });
  }
  console.log("CHECK ADMIN ROLE:", req.user.role);
  next();
};

router.get("/", authMiddleware, async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name surname email")
    .populate("courseId", "title price")
    .sort({ createdAt: -1 });

  res.json(orders);
});
// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const { courseId } = req.body;
//
//         const order = await Order.create({
//             userId: req.user.id,
//             courseId,
//         });
//
//         res.json(order);
//     } catch (err) {
//         res.status(500).json({ message: "Ошибка создания заказа" });
//     }
// });
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId обязателен" });
    }

    const order = await Order.create({
      userId: req.user.id, // из authMiddleware
      courseId,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Ошибка при создании заказа" });
  }
});

router.patch("/:id/pay", authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Заказ не найден" });

  order.status = "paid";
  await order.save();

  await User.findByIdAndUpdate(order.userId, {
    $addToSet: { courses: order.courseId },
  });

  res.json({ message: "Оплата подтверждена, доступ открыт" });
});

router.get("/my-orders", authMiddleware, getMyOrders);

export default router;
