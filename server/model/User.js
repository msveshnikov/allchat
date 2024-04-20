import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: false },
    usageStats: {
        gemini: {
            inputTokens: { type: Number, default: 0 },
            outputTokens: { type: Number, default: 0 },
            imagesGenerated: { type: Number, default: 0 },
            moneyConsumed: { type: Number, default: 0 },
        },
        claude: {
            inputTokens: { type: Number, default: 0 },
            outputTokens: { type: Number, default: 0 },
            moneyConsumed: { type: Number, default: 0 },
        },
    },
    subscriptionId: { type: String, required: false },
    subscriptionStatus: {
        type: String,
        enum: ["active", "past_due", "canceled", "none", "trialing"],
        default: "none",
    },
    info: { type: Map, of: String, default: new Map() },
});

export const User = mongoose.model("User", userSchema);

export function countTokens(text) {
    if (!text) {
        return 0;
    }
    let tokenCount = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z]/.test(char)) {
            tokenCount += 0.25;
        } else {
            tokenCount += 1;
        }
    }
    return Math.round(tokenCount);
}

export function storeUsageStats(userId, model, inputTokens, outputTokens, imagesGenerated) {
    let moneyConsumed = 0;
    const isGemini15 = model === "gemini-1.5-pro-latest";
    const isGemini10 = model === "gemini-1.0-pro-latest";
    const isClaude = model.startsWith("claude");

    if (isGemini15) {
        const inputTokensCost = (inputTokens / 1000000) * 7;
        const outputTokensCost = (outputTokens / 1000000) * 21;
        const imagesGeneratedCost = imagesGenerated * 0.01;
        moneyConsumed = inputTokensCost + outputTokensCost + imagesGeneratedCost;
    } else if (isGemini10) {
        const inputTokensCost = (inputTokens / 1000000) * 0.5;
        const outputTokensCost = (outputTokens / 1000000) * 1.5;
        const imagesGeneratedCost = imagesGenerated * 0.01;
        moneyConsumed = inputTokensCost + outputTokensCost + imagesGeneratedCost;
    } else if (isClaude) {
        const inputTokensCost = (inputTokens * 0.25) / 1000000;
        const outputTokensCost = (outputTokens * 1.25) / 1000000;
        moneyConsumed = inputTokensCost + outputTokensCost;
    }

    User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                [`usageStats.${model.slice(0, 6)}.inputTokens`]: inputTokens,
                [`usageStats.${model.slice(0, 6)}.outputTokens`]: outputTokens,
                [`usageStats.${model.slice(0, 6)}.imagesGenerated`]: imagesGenerated,
                [`usageStats.${model.slice(0, 6)}.moneyConsumed`]: moneyConsumed,
            },
        },
        { new: true }
    )
        .then(() => {})
        .catch((err) => console.error("Error updating usage stats:", err));
}
