import mongoose from "mongoose";

const customGPTSchema = new mongoose.Schema(
    {
        user: { type: String, required: false },
        name: { type: String, required: true, unique: true },
        instructions: { type: String, required: true },
        knowledge: { type: String, maxlength: 60000 },
    },
    { timestamps: true }
);

const CustomGPT = mongoose.model("CustomGPT", customGPTSchema);

export default CustomGPT;
