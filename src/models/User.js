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
        default: "student"
    }
});

export default mongoose.model("User", userSchema);
