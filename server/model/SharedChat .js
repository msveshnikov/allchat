import mongoose from "mongoose";

const sharedChatSchema = new mongoose.Schema(
    {
        user: { type: String, required: false },
        model: { type: String, required: true },
        customGPT: { type: String },
        chatHistory: { type: Object, required: true },
    },
    { timestamps: true }
);

const SharedChat = mongoose.model("SharedChat", sharedChatSchema);

export default SharedChat;
