import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";
import ffmpeg from "fluent-ffmpeg";
import {
    executePython,
    getCurrentTimeUTC,
    getFxRate,
    getLatestNews,
    getStockPrice,
    getWeather,
    persistUserInfo,
    searchWebContent,
    sendEmail,
    sendTelegramMessage,
} from "./claude.js";
import { toolsUsed } from "./index.js";
import { scheduleAction } from "./scheduler.js";
import { summarizeYouTubeVideo } from "./youtube.js";
dotenv.config({ override: true });

const tools = [
    {
        name: "get_weather",
        description:
            "Get the current weather and forecast in a given location. The tool expects an object with a 'location' property (a string with the city and state/country). It returns a string with the location, weather description, and temperature (always in C). Also, forecast for 5 days is provided.",
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
                ticker: { type: "string", description: "The ticker symbol of the stock (e.g. 'AAPL')" },
            },
            required: ["ticker"],
        },
    },
    {
        name: "get_fx_rate",
        description: "Get the current foreign exchange rate for a given currency pair",
        parameters: {
            type: "object",
            properties: {
                baseCurrency: {
                    type: "string",
                    description: "Base currency, like EUR",
                },
                quoteCurrency: {
                    type: "string",
                    description: "Quote currency, like USD",
                },
            },
            required: ["baseCurrency", "quoteCurrency"],
        },
    },
    {
        name: "send_telegram_message",
        description:
            "Send a message to a Telegram group or user. User already gave consent to receive a message from bot. The tool expects an object with 'chatId' and 'message' properties. It returns a success message.",
        parameters: {
            type: "object",
            properties: {
                chatId: { type: "string", description: "The chat ID of the Telegram group or user" },
                message: { type: "string", description: "The message to send" },
            },
            required: ["chatId", "message"],
        },
    },
    {
        name: "search_web_content",
        description: "Searches the web for the given query and returns the content of the first 3 search result pages.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The search query",
                },
            },
            required: ["query"],
        },
    },
    {
        name: "send_email",
        description:
            "Sends an email with the given subject, recipient, and content. If recipient is not provided, it uses user email from profile. Consent from user is already recieved. It returns a success message.",
        parameters: {
            type: "object",
            properties: {
                to: {
                    type: "string",
                    description:
                        "The recipient's email address (optional, if it is not provided email will be sent to the user email)",
                },
                subject: {
                    type: "string",
                    description: "The subject of the email",
                },
                content: {
                    type: "string",
                    description: "The content of the email",
                },
            },
            required: ["subject", "content"],
        },
    },
    {
        name: "get_current_time_utc",
        description: "Returns the current date and time in UTC format.",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "execute_python",
        description: "Executes the provided Python code and returns the output. Could be used for any compute.",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "The Python code to execute",
                },
            },
            required: ["code"],
        },
    },
    {
        name: "get_latest_news",
        description: "Retrieves the latest news stories from Google News for a given language.",
        parameters: {
            type: "object",
            properties: {
                lang: {
                    type: "string",
                    description:
                        "The language code for the news articles (e.g., 'en' for English, 'fr' for French, etc.)",
                },
            },
            required: ["lang"],
        },
    },
    {
        name: "persist_user_info",
        description: `Persist user information in the database. Do it if user asked you to remember something. The tool expects an object with a "key" and "value" property. It stores the key-value pair in the user's information.`,
        parameters: {
            type: "object",
            properties: {
                key: {
                    type: "string",
                    description: "The key for the user information, such as Name, Age, Location, Goal, Preference, etc",
                },
                value: {
                    type: "string",
                    description: "The value for the user information",
                },
            },
            required: ["key", "value"],
        },
    },
    {
        name: "schedule_action",
        description:
            "Schedule any action (prompt) hourly or daily. The action and result will be sent by email to the user.",
        parameters: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    description: "The action (prompt) to be scheduled",
                },
                schedule: {
                    type: "string",
                    description: "The schedule for the action execution (hourly or daily)",
                },
            },
            required: ["action", "schedule"],
        },
    },
    {
        name: "summarize_youtube_video",
        description:
            "Summarize a YouTube video based on its video ID or video URL. The tool fetches the captions from the video using the YouTube Data API and generates a summary of the video content.",
        parameters: {
            type: "object",
            properties: {
                videoId: {
                    type: "string",
                    description: "The ID or URL of the YouTube video to be summarized",
                },
            },
            required: ["videoId"],
        },
    },
];

export async function getTextGemini(prompt, temperature, imageBase64, fileType, userId, model, apiKey, webTools) {
    const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${
        apiKey || process.env.GEMINI_KEY
    }`;
    if (model === "gemini") {
        model = "gemini-1.5-pro-latest";
    }

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

    async function processVideo() {
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
                    resolve();
                })
                .screenshots({
                    count: 10,
                    folder: path.join(outputDir, "frames"),
                    filename: "frame_%05d.png",
                });
        });

        let audioPromise;
        try {
            audioPromise = new Promise((resolve, reject) => {
                ffmpeg(tempVideoPath)
                    .on("error", (err) => {
                        resolve();
                    })
                    .on("end", () => {
                        resolve();
                    })
                    .output(path.join(outputDir, "audio.mp3"))
                    .noVideo()
                    .run();
            });
        } catch (err) {
            audioPromise = Promise.resolve();
        }

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
        if (fs.existsSync(audioFilePath)) {
            const audioBase64 = fs.readFileSync(audioFilePath, { encoding: "base64" });
            const uploadedAudioFile = await uploadFile(audioBase64, "audio/mp3", "audio");
            parts.push(uploadedAudioFile);
            fs.unlinkSync(audioFilePath);
        }
    }

    const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
    const auth = new google.auth.GoogleAuth().fromAPIKey(process.env.GEMINI_KEY);
    let parts = [];

    if (fileType === "mp4") {
        await processVideo();
    } else if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
        const uploadedImageFile = await uploadFile(imageBase64, `image/png`, "image");
        parts.push(uploadedImageFile);
    } else if (fileType === "mp3" || fileType === "x-m4a" || fileType === "mpeg") {
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
        tools: webTools
            ? [
                  {
                      function_declarations: tools,
                  },
              ]
            : [],
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

                const handleFunctionCall = async (name, args) => {
                    console.log("handleFunctionCall", name, args);
                    toolsUsed.push(name);
                    let functionResponse;
                    switch (name) {
                        case "get_weather":
                            functionResponse = await getWeather(args.location);
                            break;
                        case "get_stock_price":
                            functionResponse = await getStockPrice(args.ticker);
                            break;
                        case "get_fx_rate":
                            functionResponse = await getFxRate(args.baseCurrency, args.quoteCurrency);
                            break;
                        case "send_telegram_message":
                            functionResponse = await sendTelegramMessage(args.chatId, args.message);
                            break;
                        case "search_web_content":
                            functionResponse = await searchWebContent(args.query);
                            break;
                        case "send_email":
                            functionResponse = await sendEmail(args.to, args.subject, args.content, userId);
                            break;
                        case "get_current_time_utc":
                            functionResponse = await getCurrentTimeUTC();
                            break;
                        case "execute_python":
                            functionResponse = await executePython(args.code);
                            break;
                        case "get_latest_news":
                            functionResponse = await getLatestNews(args.lang);
                            break;
                        case "persist_user_info":
                            functionResponse = await persistUserInfo(args.key, args.value, userId);
                            break;
                        case "schedule_action":
                            functionResponse = await scheduleAction(args.action, args.schedule, userId);
                            break;
                        case "summarize_youtube_video":
                            functionResponse = await summarizeYouTubeVideo(args.videoId);
                            break;
                        default:
                            console.error(`Unsupported function call: ${name}`);
                            break;
                    }
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
                                        name: name,
                                        response: {
                                            content: functionResponse,
                                        },
                                    },
                                },
                            ],
                        }
                    );
                };

                await handleFunctionCall(functionName, functionArgs);
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
