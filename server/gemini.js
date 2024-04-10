import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";

dotenv.config({ override: true });

const model = "gemini-1.5-pro-latest";
const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${process.env.GEMINI_KEY}`;

export async function getTextGemini(prompt, temperature, imageBase64, fileType) {
    const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
    const auth = new google.auth.GoogleAuth().fromAPIKey(process.env.GEMINI_KEY);

    const outputDir = "./images";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let imageBase64s = [];
    let audioBase64 = null;

    if (fileType === "mp4") {
        // Write base64-encoded video to a temporary file
        const tempVideoPath = path.join(outputDir, "temp_video.mp4");
        fs.writeFileSync(tempVideoPath, Buffer.from(imageBase64, "base64"));

        // Extract frames (one per second)
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
                    count: "infinity",
                    folder: path.join(outputDir, "frames"),
                    filename: "frame_%05d.png",
                    timemarks: ["0.5"], // Extract one frame per second
                });
        });

        // Extract audio
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

        // Remove the temporary video file
        fs.unlinkSync(tempVideoPath);

        const framesDir = path.join(outputDir, "frames");
        imageBase64s = fs.readdirSync(framesDir).map((file) => {
            const filePath = path.join(framesDir, file);
            const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });
            return imageBase64;
        });

        const audioFilePath = path.join(outputDir, "audio.mp3");
        audioBase64 = fs.readFileSync(audioFilePath, { encoding: "base64" });
    } else {
        imageBase64s = [imageBase64];
    }

    let contents = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    ...imageBase64s.map((imageBase64) => ({
                        file_data: { file_uri: "", mime_type: "image/png", data: imageBase64 },
                    })),
                    audioBase64 ? { file_data: { file_uri: "", mime_type: "audio/mpeg", data: audioBase64 } } : null,
                ].filter(Boolean),
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
