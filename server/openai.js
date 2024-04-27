import OpenAI from "openai";
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
import { renameProperty } from "./gemini.js";
import dotenv from "dotenv";
import { scheduleAction } from "./scheduler.js";
import { summarizeYouTubeVideo } from "./youtube.js";
import { toolsUsed } from "./index.js";
dotenv.config({ override: true });

export const getTextGpt = async (prompt, temperature, userId, model, apiKey, webTools) => {
    let openai;
    if (apiKey) {
        openai = new OpenAI({ apiKey });
    } else {
        openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
        model = "gpt-3.5-turbo";
    }
    const openAiTools = tools.map(renameProperty).map((f) => ({ type: "function", function: f }));
    const messages = [{ role: "user", content: prompt }];

    const getMessage = async () => {
        const completion = await openai.chat.completions.create({
            model: model || "gpt-3.5-turbo",
            max_tokens: 4096,
            messages,
            temperature: temperature || 0.5,
            tools: webTools ? openAiTools : null,
        });
        return completion?.choices?.[0]?.message;
    };

    let responseMessage = await getMessage();
    while (responseMessage?.tool_calls) {
        const toolCalls = responseMessage?.tool_calls;
        messages.push(responseMessage);
        for (const toolCall of toolCalls) {
            const toolResult = await handleToolCall(toolCall.function, userId);
            messages.push({
                role: "tool",
                name: toolCall.name,
                tool_call_id: toolCall.id,
                content: toolResult,
            });
        }
        responseMessage = await getMessage();
    }
    return responseMessage?.content;
};

const handleToolCall = async (toolCall, userId) => {
    const name = toolCall.name;
    toolsUsed.push(name);
    const args = JSON.parse(toolCall.arguments);
    console.log("handleToolCall", name, args);

    switch (name) {
        case "get_weather":
            return getWeather(args.location);
        case "get_stock_price":
            return getStockPrice(args.ticker);
        case "get_fx_rate":
            return getFxRate(args.baseCurrency, args.quoteCurrency);
        case "send_telegram_message":
            return sendTelegramMessage(args.chatId, args.message);
        case "search_web_content":
            return searchWebContent(args.query);
        case "send_email":
            return sendEmail(args.to, args.subject, args.content, userId);
        case "get_current_time_utc":
            return getCurrentTimeUTC();
        case "execute_python":
            return executePython(args.code);
        case "get_latest_news":
            return getLatestNews(args.lang);
        case "persist_user_info":
            return persistUserInfo(args.key, args.value, userId);
        case "remove_user_info":
            return removeUserInfo(userId);
        case "schedule_action":
            return scheduleAction(args.action, args.schedule, userId);
        case "summarize_youtube_video":
            return summarizeYouTubeVideo(args.videoId);
        default:
            console.error(`Unsupported function call: ${name}`);
    }
};
