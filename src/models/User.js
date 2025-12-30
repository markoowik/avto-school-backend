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
});

export default mongoose.model("User", userSchema);
