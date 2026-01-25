import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 5000;

import authRoutes from "./src/routes/auth.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import newsRoutes from "./src/routes/newsRoutes.js"
import orderRoutes from "./src/routes/orders.js"
import {getMyOrders} from "./src/controllers/order.controller.js";

import adminRoutes from "./src/routes/admin.js"



import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log("MongoDB Connected"))
     .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/news", newsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("api/my-orders", getMyOrders);




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});