import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        admin: { type: Boolean, required: false },
        ip: {
            type: String,
            required: false,
        },
        userAgent: { type: String, required: false },
        country: { type: String, required: false },
        profileUrl: { type: String, required: false },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        usageStats: {
            gemini: {
                inputTokens: { type: Number, default: 0 },
                outputTokens: { type: Number, default: 0 },
                moneyConsumed: { type: Number, default: 0 },
                imagesGenerated: { type: Number, default: 0 },
            },
            claude: {
                inputTokens: { type: Number, default: 0 },
                outputTokens: { type: Number, default: 0 },
                moneyConsumed: { type: Number, default: 0 },
            },
            together: {
                inputTokens: { type: Number, default: 0 },
                outputTokens: { type: Number, default: 0 },
                moneyConsumed: { type: Number, default: 0 },
            },
            gpt: {
                inputTokens: { type: Number, default: 0 },
                outputTokens: { type: Number, default: 0 },
                moneyConsumed: { type: Number, default: 0 },
            },
        },
        subscriptionId: { type: String, required: false },
        subscriptionStatus: {
            type: String,
            default: "none",
        },
        info: { type: Map, of: String, default: new Map() },
        scheduling: { type: Map, of: String, default: new Map() },
        achievements: [
            {
                emoji: { type: String, required: true },
                description: { type: String, required: true },
            },
        ],
        coins: { type: Number, default: 0 },
    },
    { timestamps: true }
);

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
    const isGemini15 = model?.startsWith("gemini-1.5");
    const isGemini10 = model?.startsWith("gemini-1.0");
    const isClaude = model?.startsWith("claude");
    const isGPT4o = model?.startsWith("gpt-4o");
    const isGPT35 = model?.startsWith("gpt-3.5");
    const isTogether = !isGemini15 && !isGemini10 && !isClaude && !isGPT4o && !isGPT35;
    const imagesGeneratedCost = imagesGenerated * 0.002;

    if (isGemini15) {
        const inputTokensCost = (inputTokens / 1000000) * 7;
        const outputTokensCost = (outputTokens / 1000000) * 21;
        moneyConsumed = inputTokensCost + outputTokensCost + imagesGeneratedCost;
    } else if (isGemini10) {
        const inputTokensCost = (inputTokens / 1000000) * 0.5;
        const outputTokensCost = (outputTokens / 1000000) * 1.5;
        moneyConsumed = inputTokensCost + outputTokensCost + imagesGeneratedCost;
    } else if (isClaude) {
        if (model?.includes("haiku")) {
            moneyConsumed = (inputTokens * 0.25 + outputTokens * 1.25) / 1000000;
        } else if (model?.includes("sonnet")) {
            moneyConsumed = (inputTokens * 3 + outputTokens * 15) / 1000000;
        }
    } else if (isGPT4o) {
        const inputTokensCost = (inputTokens / 1000000) * 5;
        const outputTokensCost = (outputTokens / 1000000) * 15;
        moneyConsumed = inputTokensCost + outputTokensCost;
    } else if (isGPT35) {
        const inputTokensCost = (inputTokens / 1000000) * 0.5;
        const outputTokensCost = (outputTokens / 1000000) * 1.5;
        moneyConsumed = inputTokensCost + outputTokensCost;
    } else if (isTogether) {
        moneyConsumed = (inputTokens + outputTokens) / 1000000;
    }

    if (isTogether) {
        model = "together";
    } else if (isGPT4o || isGPT35) {
        model = "gpt";
    } else {
        model = model.slice(0, 6);
    }

    User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                [`usageStats.${model}.inputTokens`]: inputTokens,
                [`usageStats.${model}.outputTokens`]: outputTokens,
                [`usageStats.${model}.moneyConsumed`]: moneyConsumed,
                [`usageStats.gemini.imagesGenerated`]: imagesGenerated,
            },
        },
        { new: true }
    )
        .then(() => {})
        .catch((err) => console.error("Error updating usage stats:", err));
}

export const addUserCoins = async (userId, coins) => {
    try {
        await User.findByIdAndUpdate(userId, { $inc: { coins } }, { new: true });
    } catch (err) {
        console.error("Error updating user coins:", err);
    }
};

export const substractUserCoins = async (userId, coins) => {
    const user = await User.findById(userId);

    if (user.coins < coins) {
        throw new Error("Insufficient coins");
    }

    await User.findByIdAndUpdate(userId, { $inc: { coins: -coins } }, { new: true });
};
