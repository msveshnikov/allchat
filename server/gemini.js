import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config({ override: true });

const vertex_ai = new VertexAI({ project: process.env.GOOGLE_KEY, location: "us-central1" });
// const model = "gemini-pro";
const model = "gemini-1.5-pro-latest";
const model_vision = "gemini-1.0-pro-vision-001";

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./allchat.json";

export const getTextVision = async (prompt, imageBase64) => {
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

const URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_KEY}`;

export const getTextGemini = async (prompt, temperature) => {
    const headers = {
        "Content-Type": "application/json",
    };

    const data = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ],
        generation_config: {
            maxOutputTokens: 4096,
            temperature: temperature || 0.5,
            topP: 0.8,
        },
    };

    const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error(response.statusText);
        throw new Error("Gemini Error:" + response.statusText);
    }

    const result = await response.json();
    return  result?.candidates?.[0]?.content?.parts?.[0]?.text;
};
