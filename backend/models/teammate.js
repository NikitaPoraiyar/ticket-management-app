import mongoose from "mongoose";

const teammateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Member"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Teammate", teammateSchema);
