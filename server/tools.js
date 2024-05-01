import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fetchPageContent, fetchSearchResults, googleNews } from "./search.js";
import { User } from "./model/User.js";
import { scheduleAction, stopScheduledAction } from "./scheduler.js";
import { contentFolder, toolsUsed } from "./index.js";
import { summarizeYouTubeVideo } from "./youtube.js";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_KEY);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const tools = [
    {
        name: "get_weather",
        description:
            "Get the current weather and forecast in a given location. The tool expects an object with a 'location' property (a string with the city and state/country). It returns a string with the location, weather description, and temperature (always in C). Also, forecast for 5 days is provided.",
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
        name: "get_fx_rate",
        description: "Get the current foreign exchange rate for a given currency pair",
        input_schema: {
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
    {
        name: "persist_user_info",
        description: `Persist user information in the database. Do it if user asked you to remember something. The tool expects an object with a "key" and "value" property. It stores the key-value pair in the user's information.`,
        input_schema: {
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
        name: "remove_user_info",
        description: "Removes all information about user.",
        input_schema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "schedule_action",
        description:
            "Schedule any action (prompt) hourly or daily. The action and result will be sent by email to the user.",
        input_schema: {
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
        name: "stop_scheduled_action",
        description: "Stop and remove any scheduled task for user.",
        input_schema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "summarize_youtube_video",
        description:
            "Summarize a YouTube video based on its video ID or video URL. The tool fetches the captions from the video using the YouTube Data API and generates a summary of the video content.",
        input_schema: {
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

export const handleToolCall = async (name, args, userId) => {
    toolsUsed.push(name);
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
        case "stop_scheduled_action":
            return stopScheduledAction(userId);
        case "summarize_youtube_video":
            return summarizeYouTubeVideo(args.videoId);
        default:
            console.error(`Unsupported function call: ${name}`);
    }
};

export async function getWeather(location) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`;
        const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
        const [weatherData, forecastData] = await Promise.all([weatherResponse.json(), forecastResponse.json()]);
        const { name, weather, main } = weatherData;
        const { list } = forecastData;

        const currentWeather = `In ${name}, the weather is ${
            weather?.[0]?.description
        } with a temperature of ${Math.round(main?.temp - 273)}°C`;

        const fiveDayForecast = list
            ?.filter((_, index) => index % 8 === 4) //noon
            ?.map((item) => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                const temperature = Math.round(item.main.temp - 273);
                const description = item.weather[0].description;
                return `On ${date}, the weather will be ${description} with a temperature of ${temperature}°C`;
            })
            ?.join("\n");

        return `${currentWeather}\n\nFive-day forecast:\n${fiveDayForecast}`;
    } catch (error) {
        console.error("Error fetching weather:", error);
        return "Error fetching weather:" + error.message;
    }
}

export async function getStockPrice(ticker) {
    try {
        const apiUrl = `https://yfapi.net/v8/finance/chart/${ticker}?range=1wk&interval=1d&lang=en-US&region=US&includePrePost=false&corsDomain=finance.yahoo.com`;
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
        return "Error fetching stock price:" + error.message;
    }
}

export async function getFxRate(baseCurrency, quoteCurrency) {
    try {
        const apiUrl = `https://yfapi.net/v6/finance/quote?symbols=${baseCurrency + quoteCurrency + "=X"}`;
        const response = await fetch(apiUrl, {
            headers: {
                "X-API-KEY": process.env.YAHOO_FINANCE_API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        return `Current exchange rates for ${baseCurrency + quoteCurrency + "=X"}: ${
            data?.quoteResponse?.result?.[0]?.regularMarketPrice
        }. Additional info: ${JSON.stringify(data?.quoteResponse?.result?.[0])}`;
    } catch (error) {
        console.error("Error fetching FX rates:", error);
        return "Error fetching FX rates:" + error.message;
    }
}

export async function sendTelegramMessage(chatId, message) {
    try {
        await bot.sendMessage(chatId, message);
        return "Telegram message sent successfully.";
    } catch (error) {
        console.error("Error sending Telegram message:", error);
        return "Error sending Telegram message:" + error.message;
    }
}

export async function sendEmail(to, subject, content, userId) {
    let recipient;

    if (to && !to?.endsWith("@example.com")) {
        recipient = to;
    } else {
        const user = await User.findById(userId);
        if (!user || !user.email) {
            return "No recipient email address provided or found in user profile";
        }
        recipient = user.email;
    }
    const mailOptions = {
        to: recipient,
        from: process.env.EMAIL,
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
    if (response.ok) {
        const jsonData = JSON.parse(data);
        let output = jsonData.output;
        const newFiles = jsonData.new_files;
        for (const [filePath, base64Content] of Object.entries(newFiles)) {
            const fileName = path.basename(filePath);
            const fileContent = Buffer.from(base64Content, "base64");
            const fileSavePath = path.join(contentFolder, fileName);
            fs.writeFileSync(fileSavePath, fileContent);
            const hyperlink = `[${fileName}](/api/get?file=${encodeURIComponent(fileName)})`;
            output += `\n${hyperlink}`;
        }
        return output;
    } else {
        return data;
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

export async function persistUserInfo(key, value, userId) {
    try {
        let user = await User.findById(userId);
        user.info.set(key, value);
        await user.save();
        return `User information ${key}: ${value} persisted successfully.`;
    } catch (error) {
        console.error("Error persisting user information:", error);
        return "Error persisting user information:" + error.message;
    }
}

export async function removeUserInfo(userId) {
    try {
        const user = await User.findById(userId);
        user.info = {}; // Clear the user's info object
        await user.save();
        return `User information removed successfully for user ${userId}.`;
    } catch (error) {
        console.error("Error removing user information:", error);
        return "Error removing user information: " + error.message;
    }
}
