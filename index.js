import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const PORT = process.env.PORT || 5000;

import authRoutes from "./src/routes/auth.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: "*",
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log("MongoDB Connected"))
     .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/applications", applicationRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});