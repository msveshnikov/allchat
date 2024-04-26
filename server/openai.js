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

    const completion = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        max_tokens: 4096,
        messages,
        temperature: temperature || 0.5,
        tools: webTools ? openAiTools : null,
    });
    let responseMessage = completion?.choices?.[0]?.message;

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

        const completion = await openai.chat.completions.create({
            model: model || "gpt-3.5-turbo",
            max_tokens: 4096,
            messages,
            temperature: temperature || 0.5,
            tools: webTools ? openAiTools : null,
        });
        responseMessage = completion?.choices?.[0]?.message;
    }
    return responseMessage?.content;
};

const handleToolCall = async (toolCall, userId) => {
    const name = toolCall.name;
    toolsUsed.push(name);
    const args = JSON.parse(toolCall.arguments);
    console.log("handleToolCall", name, args);
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
    }

    return functionResponse;
};
