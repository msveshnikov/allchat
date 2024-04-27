import {
    executePython,
    getCurrentTimeUTC,
    getFxRate,
    getLatestNews,
    getStockPrice,
    getWeather,
    persistUserInfo,
    removeUserInfo,
    searchWebContent,
    sendEmail,
    sendTelegramMessage,
    tools,
} from "./claude.js";
import { VertexAI } from "@google-cloud/vertexai";
import { toolsUsed } from "./index.js";
import { scheduleAction } from "./scheduler.js";
import { summarizeYouTubeVideo } from "./youtube.js";
import dotenv from "dotenv";
dotenv.config({ override: true });
process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./allchat.json";

export const renameProperty = (obj) => {
    const newObj = { ...obj };
    newObj["parameters"] = newObj["input_schema"];
    delete newObj["input_schema"];
    return newObj;
};

export async function getTextGemini(prompt, temperature, imageBase64, fileType, userId, model, apiKey, webTools) {
    const vertex_ai = new VertexAI({ project: apiKey || process.env.GOOGLE_KEY, location: "us-central1" });

    if (model === "gemini-1.5-pro-latest" || model === "gemini") {
        model = "gemini-1.5-pro-preview-0409";
    }

    if (model === "gemini-1.0-pro-latest") {
        model = "gemini-1.0-pro";
    }

    let parts = [];

    if (fileType === "mp4") {
        parts.push({
            inlineData: {
                mimeType: "video/mp4",
                data: imageBase64,
            },
        });
    } else if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
        parts.push({
            inlineData: {
                mimeType: "image/png",
                data: imageBase64,
            },
        });
    } else if (fileType === "mp3" || fileType === "x-m4a" || fileType === "mpeg") {
        parts.push({
            inlineData: {
                mimeType: "audio/mp3",
                data: imageBase64,
            },
        });
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
                      function_declarations: tools.map(renameProperty),
                  },
              ]
            : [],
    };

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
            maxOutputTokens: 8192,
            temperature: temperature || 0.5,
        },
    });

    let finalResponse = null;

    while (!finalResponse) {
        const generateContentResponse = await generativeModel.generateContent(contents);
        const modelResponse = generateContentResponse?.response?.candidates?.[0]?.content;

        if (modelResponse) {
            const functionCallPart = modelResponse?.parts?.find((part) => part.functionCall);

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
                        case "remove_user_info":
                            functionResponse = await removeUserInfo(userId);
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
                finalResponse = modelResponse?.parts?.[0]?.text;
            }
        } else {
            console.log("No valid response from the model");
            break;
        }
    }

    return finalResponse;
}
