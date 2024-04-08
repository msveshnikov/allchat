import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ override: true });

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });

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
];

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
                toolResult = `Last week's stock prices: ${stockPrices.join(", ")}`;
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
