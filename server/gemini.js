import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config({ override: true });

const vertex_ai = new VertexAI({ project: process.env.GOOGLE_KEY, location: "us-central1" });
const model = "gemini-pro";
// const model = "gemini-1.5-pro-latest";
const model_vision = "gemini-1.0-pro-vision-001";

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

export const getTextVision = async (prompt, imageBase64, temperature) => {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model_vision,
        generation_config: {
            max_output_tokens: 2048,
            temperature: 0.4,
            top_p: 1,
            top_k: 32,
        },
    });

    const req = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }, { inline_data: { mime_type: "image/png", data: imageBase64 } }],
            },
        ],
    };

    const response = await generativeModel.generateContent(req);
    const aggregatedResponse = await response.response;
    return aggregatedResponse.candidates[0].content.parts[0].text;
};
