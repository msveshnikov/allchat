import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";
dotenv.config({ override: true });

const model = "gemini-1.5-pro-latest";
const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${process.env.GEMINI_KEY}`;

export async function getTextVision(prompt, temperature, imageBase64) {
    const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
    const auth = new google.auth.GoogleAuth().fromAPIKey(process.env.GEMINI_KEY);

    let file_data;
    if (imageBase64) {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBase64, "base64"));
        const media = {
            mimeType: "image/png",
            body: bufferStream,
        };
        let body = { file: { displayName: "Uploaded Image" } };
        const createFileResponse = await genaiService.media.upload({
            media: media,
            auth: auth,
            requestBody: body,
        });
        const file = createFileResponse.data.file;
        file_data = { file_uri: file.uri, mime_type: file.mimeType };
    }

    const contents = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }, file_data && { file_data }],
            },
        ],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
        generation_config: {
            maxOutputTokens: 4096,
            temperature: temperature || 0.5,
            topP: 0.8,
        },
    };

    const generateContentResponse = await genaiService.models.generateContent({
        model: `models/${model}`,
        requestBody: contents,
        auth: auth,
    });

    return generateContentResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
}
