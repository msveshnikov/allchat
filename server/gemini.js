import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";
import ffmpeg from "fluent-ffmpeg";
import { getWeather } from "./claude";
dotenv.config({ override: true });

const model = "gemini-1.5-pro-latest";
const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${process.env.GEMINI_KEY}`;

const tools = [
    {
        name: "get_weather",
        description:
            "Get the current weather in a given location. The tool expects an object with a 'location' property (a string with the city and state/country). It returns a string with the location, weather description, and temperature (always in C).",
        parameters: {
            type: "object",
            properties: {
                location: { type: "string", description: "The city and state/country, e.g. San Francisco, CA" },
            },
            required: ["location"],
        },
    },
    {
        name: "get_stock_price",
        description:
            "Retrieves the last week's stock price for a given ticker symbol. The tool expects a string with the ticker symbol (e.g. 'AAPL'). It returns an array of stock prices for the last week.",
        parameters: {
            type: "object",
            properties: {
                ticker: {
                    type: "string",
                    description: "The ticker symbol of the stock (e.g. 'AAPL')",
                },
            },
            required: ["ticker"],
        },
    },
    {
        name: "send_telegram_message",
        description:
            "Send a message to a Telegram group or user. User already gave consent to recieve a message from bot. The tool expects an object with 'chatId' and 'message' properties. It returns a success message.",
        parameters: {
            type: "object",
            properties: {
                chatId: {
                    type: "string",
                    description: "The chat ID of the Telegram group or user",
                },
                message: {
                    type: "string",
                    description: "The message to send",
                },
            },
            required: ["chatId", "message"],
        },
    },
];

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
        tools: [
            {
                function_declarations: tools,
            },
        ],
        generation_config: {
            maxOutputTokens: 8192,
            temperature: temperature || 0.5,
            topP: 0.8,
        },
    };

    let finalResponse = null;

    while (!finalResponse) {
        const generateContentResponse = await genaiService.models.generateContent({
            model: `models/${model}`,
            requestBody: contents,
            auth: auth,
        });

        const modelResponse = generateContentResponse?.data?.candidates?.[0]?.content;

        if (modelResponse) {
            const functionCallPart = modelResponse.parts.find((part) => part.functionCall);

            if (functionCallPart) {
                const functionCall = functionCallPart.functionCall;
                const functionName = functionCall.name;
                const functionArgs = functionCall.args;

                if (functionName === "get_weather") {
                    const weatherResponse = await getWeather(functionArgs.location);
                    contents.contents.push(
                        {
                            role: "model",
                            parts: [{ functionCall: functionCall }],
                        },
                        {
                            role: "function",
                            parts: [
                                {
                                    functionResponse: {
                                        name: "get_weather",
                                        response: {
                                            content: weatherResponse,
                                        },
                                    },
                                },
                            ],
                        }
                    );
                } else {
                    // Add support for other function calls here
                    console.log(`Unsupported function call: ${functionName}`);
                    break;
                }
            } else {
                finalResponse = modelResponse.parts[0].text;
            }
        } else {
            console.log("No valid response from the model");
            break;
        }
    }

    return finalResponse;
}
