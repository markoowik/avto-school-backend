import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true, 
    },
})

export const Admin = mongoose.model("Admin", adminSchema);