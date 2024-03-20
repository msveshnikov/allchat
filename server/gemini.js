import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config({ override: true });

const vertex_ai = new VertexAI({ project: process.env.GOOGLE_KEY, location: "us-central1" });
const model = "gemini-pro";

export const getTextGemini = async (prompt, temperature) => {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
            max_output_tokens: 4096,
            temperature: temperature || 0.8,
            top_p: 0.8,
        },
    });

    const chat = generativeModel.startChat({});
    const result = await chat.sendMessage([{ text: prompt }]);
    return result?.response?.candidates?.[0].content?.parts?.[0]?.text;
};
