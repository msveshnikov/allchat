import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";
import ffmpeg from "fluent-ffmpeg";

dotenv.config({ override: true });

const model = "gemini-1.5-pro-latest";
const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${process.env.GEMINI_KEY}`;

export async function getTextGemini(prompt, temperature, imageBase64, fileType) {
    async function uploadFile(fileBase64, mimeType, displayName) {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(fileBase64, "base64"));
        const media = {
            mimeType: mimeType,
            body: bufferStream,
        };
        let body = { file: { displayName: displayName } };
        const createFileResponse = await genaiService.media.upload({
            media: media,
            auth: auth,
            requestBody: body,
        });
        const uploadedFile = createFileResponse.data.file;
        return { file_data: { file_uri: uploadedFile.uri, mime_type: uploadedFile.mimeType } };
    }

    const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
    const auth = new google.auth.GoogleAuth().fromAPIKey(process.env.GEMINI_KEY);
    let parts = [];

    if (fileType === "mp4") {
        const outputDir = "./images";
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const tempVideoPath = path.join(outputDir, "temp_video.mp4");
        fs.writeFileSync(tempVideoPath, Buffer.from(imageBase64, "base64"));

        const framePromise = new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath)
                .on("error", (err) => {
                    console.error("Error extracting frames:", err);
                    reject(err);
                })
                .on("end", () => {
                    console.log("Frames extraction completed");
                    resolve();
                })
                .screenshots({
                    count: 10,
                    folder: path.join(outputDir, "frames"),
                    filename: "frame_%05d.png",
                });
        });

        const audioPromise = new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath)
                .on("error", (err) => {
                    console.error("Error extracting audio:", err);
                    reject(err);
                })
                .on("end", () => {
                    console.log("Audio extraction completed");
                    resolve();
                })
                .output(path.join(outputDir, "audio.mp3"))
                .noVideo()
                .run();
        });

        await Promise.all([framePromise, audioPromise]);
        fs.unlinkSync(tempVideoPath);

        const framesDir = path.join(outputDir, "frames");
        const frameFiles = fs.readdirSync(framesDir);
        for (const file of frameFiles) {
            const filePath = path.join(framesDir, file);
            const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });
            const uploadedFile = await uploadFile(imageBase64, "image/png", file);
            parts.push(uploadedFile);
            fs.unlinkSync(filePath);
        }

        const audioFilePath = path.join(outputDir, "audio.mp3");
        const audioBase64 = fs.readFileSync(audioFilePath, { encoding: "base64" });
        const uploadedAudioFile = await uploadFile(audioBase64, "audio/mp3", "audio");
        parts.push(uploadedAudioFile);
        fs.unlinkSync(audioFilePath);
    } else if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
        const uploadedImageFile = await uploadFile(imageBase64, `image/png`, "image");
        parts.push(uploadedImageFile);
    } else if (fileType === "mp3" || fileType === "x-m4a") {
        const uploadedAudioFile = await uploadFile(imageBase64, `audio/mp3`, "audio");
        parts.push(uploadedAudioFile);
    }

    const contents = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }, ...parts],
            },
        ],
        generation_config: {
            maxOutputTokens: 8192,
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
