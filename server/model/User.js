import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: false },
    usageStats: {
        gemini: {
            inputCharacters: { type: Number, default: 0 },
            outputCharacters: { type: Number, default: 0 },
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
});

export const User = mongoose.model("User", userSchema);

export function countCharacters(text) {
    if (!text) {
        return 0;
    }
    return text.length;
}

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

export function storeUsageStats(
    userId,
    model,
    inputTokens,
    outputTokens,
    inputCharacters,
    outputCharacters,
    imagesGenerated
) {
    let moneyConsumed = 0;

    if (model === "gemini") {
        const inputCharactersCost = (inputCharacters / 1000) * 0.000125;
        const outputCharactersCost = (outputCharacters / 1000) * 0.000375;
        const imagesGeneratedCost = imagesGenerated * 0.01;
        moneyConsumed = inputCharactersCost + outputCharactersCost + imagesGeneratedCost;
    } else if (model === "claude") {
        const inputTokensCost = (inputTokens * 0.25) / 1000000;
        const outputTokensCost = (outputTokens * 1.25) / 1000000;
        moneyConsumed = inputTokensCost + outputTokensCost;
    }

    User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                [`usageStats.${model}.inputTokens`]: inputTokens,
                [`usageStats.${model}.outputTokens`]: outputTokens,
                [`usageStats.${model}.inputCharacters`]: inputCharacters,
                [`usageStats.${model}.outputCharacters`]: outputCharacters,
                [`usageStats.${model}.imagesGenerated`]: imagesGenerated,
                [`usageStats.${model}.moneyConsumed`]: moneyConsumed,
            },
        },
        { new: true }
    )
        .then(() => {})
        .catch((err) => console.error("Error updating usage stats:", err));
}
