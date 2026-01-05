import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("News", newsSchema);
