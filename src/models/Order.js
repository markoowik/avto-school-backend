import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
    },
    {
        timestamps: true, // 👈 createdAt, updatedAt
    }
);

export default mongoose.model("Order", orderSchema);
