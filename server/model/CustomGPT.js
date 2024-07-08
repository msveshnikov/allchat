import mongoose from "mongoose";

const customGPTSchema = new mongoose.Schema(
    {
        user: { type: String, required: false },
        name: { type: String, required: true, unique: true },
        instructions: { type: String, required: true },
        profileUrl: { type: String, required: false },
        knowledge: { type: String, maxlength: 60000 },
        isPrivate: { type: Boolean, required: false, default: true },
    },
    { timestamps: true }
);

const CustomGPT = mongoose.model("CustomGPT", customGPTSchema);

export default CustomGPT;
