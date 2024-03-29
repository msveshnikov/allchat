import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";
dotenv.config({ override: true });

const model = "gemini-1.5-pro-latest";

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
    return result?.candidates?.[0]?.content?.parts?.[0]?.text;
};

const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${process.env.GEMINI_KEY}`;
export async function getTextVision(prompt, imageBase64) {
    const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
    const auth = new google.auth.GoogleAuth().fromAPIKey(process.env.GEMINI_KEY);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(imageBase64, "base64"));

    const media = {
        mimeType: "image/png",
        body: bufferStream,
    };
    var body = { file: { displayName: "Uploaded Image" } };

    const createFileResponse = await genaiService.media.upload({
        media: media,
        auth: auth,
        requestBody: body,
    });
    const file = createFileResponse.data.file;
    const fileUri = file.uri;
    console.log("Uploaded file: " + fileUri);

    const contents = {
        contents: [
            {
                parts: [{ text: prompt }, { file_data: { file_uri: fileUri, mime_type: file.mimeType } }],
            },
        ],
    };

    const generateContentResponse = await genaiService.models.generateContent({
        model: `models/${model}`,
        requestBody: contents,
        auth: auth,
    });

    return generateContentResponse.data.candidates[0].content.parts[0].text;
}
