import mongoose from "mongoose";

const customGPTSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        instructions: { type: String, required: true },
        knowledge: { type: String, maxlength: 60000 },
    },
    { timestamps: true }
);

const CustomGPT = mongoose.model("CustomGPT", customGPTSchema);

export default CustomGPT;
