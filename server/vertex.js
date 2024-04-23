import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config({ override: true });

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./allchat.json";

const vertex_ai = new VertexAI({ project: process.env.GOOGLE_KEY, location: "europe-west3" });
const model = "gemini-1.5-pro-preview-0409";
// const model = "gemini-1.0-pro" 

const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
    },
});

const image1 = {
    inlineData: {
        mimeType: "image/png",
        data: `iVBORw0AAAElFTkSuQmCC`,
    },
};
const video1 = {
    inlineData: {
        mimeType: "video/mp4",
        data: `AAAAGGZ0e0Y8F470r88=`,
    },
};

async function generateContent() {
    const req = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: "hi" },
                    image1, { text: `what is it` },
                    video1, { text: `and this?` }
                ],
            },
        ],
    };

    const generateContentResponse = await generativeModel.generateContent(req);
    const modelResponse = generateContentResponse?.response?.candidates?.[0]?.content;
    const finalResponse = modelResponse?.parts?.[0]?.text;
    console.log(finalResponse);
}

generateContent();
