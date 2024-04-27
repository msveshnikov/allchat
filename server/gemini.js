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
                    switch (name) {
                        case "get_weather":
                            return await getWeather(args.location);
                        case "get_stock_price":
                            return await getStockPrice(args.ticker);
                        case "get_fx_rate":
                            return await getFxRate(args.baseCurrency, args.quoteCurrency);
                        case "send_telegram_message":
                            return await sendTelegramMessage(args.chatId, args.message);
                        case "search_web_content":
                            return await searchWebContent(args.query);
                        case "send_email":
                            return await sendEmail(args.to, args.subject, args.content, userId);
                        case "get_current_time_utc":
                            return await getCurrentTimeUTC();
                        case "execute_python":
                            return await executePython(args.code);
                        case "get_latest_news":
                            return await getLatestNews(args.lang);
                        case "persist_user_info":
                            return await persistUserInfo(args.key, args.value, userId);
                        case "remove_user_info":
                            return await removeUserInfo(userId);
                        case "schedule_action":
                            return await scheduleAction(args.action, args.schedule, userId);
                        case "summarize_youtube_video":
                            return await summarizeYouTubeVideo(args.videoId);
                        default:
                            console.error(`Unsupported function call: ${name}`);
                    }
                };

                const functionResponse = await handleFunctionCall(functionName, functionArgs);
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
                                    name: functionName,
                                    response: {
                                        content: functionResponse,
                                    },
                                },
                            },
                        ],
                    }
                );
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
