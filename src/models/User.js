import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    surname: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    balance: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },
    telegramId: {
        type: Number,
        default: null,
    }
});

export default mongoose.model("User", userSchema);
