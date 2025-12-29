import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true, // A, B, C
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        features: {
            type:[String],
            default: [],
        },
        price: {
            type: Number,
            required: true,
        },
        vehicleType: {
            type: String, // авто, мотоцикл, грузовик
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
