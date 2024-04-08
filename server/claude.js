import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { fetchPageContent, fetchSearchResults } from "./search.js";
dotenv.config({ override: true });

const bot = new TelegramBot(process.env.TELEGRAM_KEY);
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });

const tools = [
    {
        name: "get_weather",
        description:
            "Get the current weather in a given location. The tool expects an object with a 'location' property (a string with the city and state/country). It returns a string with the location, weather description, and temperature (always in C).",
        input_schema: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The city and state/country, e.g. San Francisco, CA",
                },
            },
            required: ["location"],
        },
    },
    {
        name: "get_stock_price",
        description:
            "Retrieves the last week's stock price for a given ticker symbol. The tool expects a string with the ticker symbol (e.g. 'AAPL'). It returns an array of stock prices for the last week.",
        input_schema: {
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
            "Send a message and/or photo to a Telegram group, user, or username. User already gave consent to recieve a message from bot. The tool expects an object with 'chatId' and 'message' properties, and an optional 'photo' property (base64 encoded image data). It returns a success message.",
        input_schema: {
            type: "object",
            properties: {
                chatId: {
                    type: "string",
                    description: "The chat ID of the Telegram group or user, or the @username",
                },
                message: {
                    type: "string",
                    description: "The message to send",
                },
                photo: {
                    type: "string",
                    description: "Base64 encoded image data (optional)",
                },
            },
            required: ["chatId", "message"],
        },
    },
    {
        name: "search_web_content",
        description: "Searches the web for the given query and returns the content of the first 3 search result pages.",
        input_schema: {
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
];

async function getWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const { name, weather, main } = data;
    return `In ${name}, the weather is ${weather?.[0]?.description} with a temperature of ${Math.round(
        main?.temp - 273
    )}°C`;
}

async function getStockPrice(ticker) {
    console.log("getStockPrice", ticker);
    const apiKey = process.env.YAHOO_FINANCE_API_KEY;
    const apiUrl = `https://yfapi.net/v8/finance/chart/${ticker}?range=1wk&interval=1d&lang=en-US&region=US&includePrePost=false&corsDomain=finance.yahoo.com`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "X-API-KEY": apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        const lastWeekPrices = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
        return lastWeekPrices;
    } catch (error) {
        console.error("Error fetching stock price:", error);
        throw error;
    }
}
async function resolveUsername(username) {
    try {
        const chat = await bot.getChat(`@${username}`);
        return chat.id;
    } catch (error) {
        console.error(`Error resolving username ${username}:`, error);
        throw error;
    }
}

async function sendTelegramMessage(chatId, message, photo) {
    try {
        const isUsername = chatId.startsWith("@");
        const resolvedChatId = isUsername ? await resolveUsername(chatId.slice(1)) : chatId;

        if (photo) {
            await bot.sendPhoto(resolvedChatId, photo, { caption: message });
        } else {
            await bot.sendMessage(resolvedChatId, message);
        }
        return "Telegram message sent successfully.";
    } catch (error) {
        console.error("Error sending Telegram message:", error);
        throw error;
    }
}

async function processToolResult(data, temperature, messages) {
    console.log("processToolResult", data, temperature, messages);
    const toolUses = data.content.filter((block) => block.type === "tool_use");
    if (!toolUses.length) {
        return data?.content?.[0]?.text;
    }

    const toolResults = await Promise.all(
        toolUses.map(async (toolUse) => {
            let toolResult;
            if (toolUse.name === "get_weather") {
                const { location } = toolUse.input;
                toolResult = await getWeather(location);
            } else if (toolUse.name === "get_stock_price") {
                const { ticker } = toolUse.input;
                const stockPrices = await getStockPrice(ticker);
                toolResult = `Last week's stock prices: ${stockPrices?.join(", ")}`;
            } else if (toolUse.name === "send_telegram_message") {
                const { chatId, message, photo } = toolUse.input;
                toolResult = await sendTelegramMessage(chatId, message, photo);
            } else if (toolUse.name === "search_web_content") {
                const { query } = toolUse.input;
                const searchResults = await fetchSearchResults(query);
                const pageContents = await Promise.all(
                    searchResults.slice(0, 3).map(async (result) => {
                        return await fetchPageContent(result.link);
                    })
                );
                toolResult = pageContents?.join("\n");
            }
            return {
                tool_use_id: toolUse.id,
                content: toolResult,
            };
        })
    );
    console.log(toolResults);

    const newMessages = [
        ...messages,
        {
            role: "assistant",
            content: data.content,
        },
        {
            role: "user",
            content: toolResults.map((toolResult) => ({
                type: "tool_result",
                ...toolResult,
            })),
        },
    ];

    const newData = await anthropic.beta.tools.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: temperature || 0.5,
        tools,
        messages: newMessages,
    });
    console.log("Stop reason ", newData.stop_reason);
    if (newData.stop_reason === "tool_use") {
        return await processToolResult(newData, temperature, newMessages);
    } else {
        return newData?.content?.[0]?.text;
    }
}

export const getTextClaude = async (prompt, temperature, imageBase64, fileType) => {
    const messages = [
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                ...(imageBase64
                    ? [
                          {
                              type: "image",
                              source: {
                                  type: "base64",
                                  media_type: fileType === "png" ? "image/png" : "image/jpeg",
                                  data: imageBase64,
                              },
                          },
                      ]
                    : []),
            ],
        },
    ];

    const data = await anthropic.beta.tools.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: temperature || 0.5,
        tools,
        messages,
    });

    if (!data) {
        throw new Error("Anthropic Claude Error");
    } else {
        if (data.stop_reason === "tool_use") {
            return processToolResult(data, temperature, messages);
        } else {
            return data?.content?.[0]?.text;
        }
    }
};
