import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
dotenv.config({ override: true });

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_KEY,
});

export const getTextClaude = async (prompt, model, temperature) => {
    const data = await anthropic.messages.create({
        model: model,
        max_tokens: 4096,
        temperature: temperature || 0.5,
        messages: [{ role: "user", content: prompt }],
    });
    if (!data) {
        throw new Error("Anthropic Claude Error");
    } else {
        return data?.content?.[0]?.text;
    }
};
