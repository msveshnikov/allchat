import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const getTextGpt = async (prompt, temperature, model, apiKey) => {
    let openai;
    if (apiKey) {
        openai = new OpenAI({ apiKey });
    } else {
        openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
        model = "gpt-3.5-turbo";
    }

    const completion = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: temperature || 0.5,
    });
    return completion.choices?.[0]?.message?.content;
};
