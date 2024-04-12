import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import nodemailer from "nodemailer";
import { fetchPageContent, fetchSearchResults, googleNews } from "./search.js";
import { User } from "./model/User.js";
dotenv.config({ override: true });

const bot = new TelegramBot(process.env.TELEGRAM_KEY);
let anthropic;

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
            "Send a message to a Telegram group or user. User already gave consent to recieve a message from bot. The tool expects an object with 'chatId' and 'message' properties. It returns a success message.",
        input_schema: {
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
    {
        name: "send_email",
        description:
            "Sends an email with the given subject, recipient, and content. If recipient is not provided, it uses user email from profile. Consent from user is already recieved. It returns a success message.",
        input_schema: {
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
        input_schema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "execute_python",
        description: "Executes the provided Python code and returns the output. Could be used for any compute.",
        input_schema: {
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
        input_schema: {
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
];

export async function getWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const { name, weather, main } = data;
    return `In ${name}, the weather is ${weather?.[0]?.description} with a temperature of ${Math.round(
        main?.temp - 273
    )}°C`;
}

export async function getStockPrice(ticker) {
    const apiUrl = `https://yfapi.net/v8/finance/chart/${ticker}?range=1wk&interval=1d&lang=en-US&region=US&includePrePost=false&corsDomain=finance.yahoo.com`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "X-API-KEY": process.env.YAHOO_FINANCE_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        const stockPrices = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
        return `Last week's stock prices: ${stockPrices?.join(", ")}`;
    } catch (error) {
        console.error("Error fetching stock price:", error);
        throw error;
    }
}

export async function sendTelegramMessage(chatId, message) {
    try {
        await bot.sendMessage(chatId, message);
        return "Telegram message sent successfully.";
    } catch (error) {
        console.error("Error sending Telegram message:", error);
        throw error;
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendEmail(to, subject, content, userId) {
    let recipient;

    if (to && !to?.endsWith("@example.com")) {
        recipient = to;
    } else {
        const user = await User.findById(userId);
        if (!user || !user.email) {
            throw new Error("No recipient email address provided or found in user profile.");
        }
        recipient = user.email;
    }
    const mailOptions = {
        to: recipient,
        from: "MangaTVShop@gmail.com",
        subject,
        text: content,
    };
    const info = await transporter.sendMail(mailOptions);
    return `Email sent: ${info.response}`;
}

export async function getCurrentTimeUTC() {
    const currentTime = new Date().toUTCString();
    return `The current time in UTC is: ${currentTime}`;
}

export async function executePython(code) {
    const pythonServerUrl =
        process.env.NODE_ENV === "production" ? "http://python-shell:8000" : "http://localhost:8000";
    const response = await fetch(pythonServerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: code,
    });
    const data = await response.text();
    const jsonData = JSON.parse(data);
    if (response.ok) {
        return jsonData.output;
    } else {
        return { error: data };
    }
}

export async function getLatestNews(lang) {
    const newsResults = await googleNews(lang);
    return newsResults.map((n) => n.title + " " + n.description).join("\n");
}

export async function searchWebContent(query) {
    const searchResults = await fetchSearchResults(query);
    const pageContents = await Promise.all(
        searchResults.slice(0, 3).map(async (result) => {
            return await fetchPageContent(result.link);
        })
    );
    return pageContents?.join("\n");
}

async function processToolResult(data, temperature, messages, userId, model, webTools) {
    console.log("processToolResult", data, temperature, messages);

    const toolUses = data.content.filter((block) => block.type === "tool_use");
    if (!toolUses.length) {
        return data?.content?.[0]?.text;
    }

    const toolResults = await Promise.all(
        toolUses.map(async (toolUse) => {
            let toolResult;

            switch (toolUse.name) {
                case "get_weather":
                    const { location } = toolUse.input;
                    toolResult = await getWeather(location);
                    break;
                case "get_stock_price":
                    const { ticker } = toolUse.input;
                    toolResult = await getStockPrice(ticker);
                    break;
                case "send_telegram_message":
                    const { chatId, message } = toolUse.input;
                    toolResult = await sendTelegramMessage(chatId, message);
                    break;
                case "search_web_content":
                    const { query } = toolUse.input;
                    toolResult = await searchWebContent(query);
                    break;
                case "send_email":
                    const { to, subject, content } = toolUse.input;
                    toolResult = await sendEmail(to, subject, content, userId);
                    break;
                case "get_current_time_utc":
                    toolResult = await getCurrentTimeUTC();
                    break;
                case "execute_python":
                    const { code } = toolUse.input;
                    toolResult = await executePython(code);
                    break;
                case "get_latest_news":
                    const { lang } = toolUse.input;
                    toolResult = await getLatestNews(lang);
                    break;
                default:
                    console.error(`Unsupported function call: ${toolUse.name}`);
                    break;
            }

            return { tool_use_id: toolUse.id, content: toolResult };
        })
    );
    console.log(toolResults);

    const newMessages = [
        ...messages,
        { role: "assistant", content: data.content },
        {
            role: "user",
            content: toolResults.map((toolResult) => ({
                type: "tool_result",
                ...toolResult,
            })),
        },
    ];

    const newData = await anthropic.beta.tools.messages.create({
        model,
        max_tokens: 4096,
        temperature: temperature || 0.5,
        tools: webTools ? tools : [],
        messages: newMessages,
    });
    if (newData.stop_reason === "tool_use") {
        return await processToolResult(newData, temperature, newMessages, userId, model, webTools);
    } else {
        return newData?.content?.[0]?.text;
    }
}

export const getTextClaude = async (prompt, temperature, imageBase64, fileType, userId, model, apiKey, webTools) => {
    if (apiKey) {
        anthropic = new Anthropic({ apiKey });
    } else {
        anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });
        model = "claude-3-haiku-20240307";
    }

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
        model,
        max_tokens: 4096,
        temperature: temperature || 0.5,
        tools: webTools ? tools : [],
        messages,
    });

    if (!data) {
        throw new Error("Anthropic Claude Error");
    } else {
        if (data.stop_reason === "tool_use") {
            return processToolResult(data, temperature, messages, userId, model, webTools);
        } else {
            return data?.content?.[0]?.text;
        }
    }
};
