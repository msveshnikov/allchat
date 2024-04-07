import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ override: true });

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });

const getWeather = async (location, unit = "celsius") => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();
    const { name, weather, main } = data;
    return `In ${name}, the weather is ${weather[0].description} with a temperature of ${main.temp - 273}°${
        unit === "celsius" ? "C" : "F"
    }.`;
};

export const getTextClaude = async (prompt, temperature, imageBase64, fileType) => {
    const tools = [
        {
            name: "get_weather",
            description:
                "Get the current weather in a given location. The tool expects an object with a 'location' property (a string with the city and state/country) and an optional 'unit' property ('celsius' or 'fahrenheit'). It returns a string with the location, weather description, and temperature.",
            input_schema: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "The city and state/country, e.g. San Francisco, CA",
                    },
                    unit: {
                        type: "string",
                        enum: ["celsius", "fahrenheit"],
                        description: "The unit of temperature, either 'celsius' or 'fahrenheit'",
                    },
                },
                required: ["location"],
            },
        },
    ];

    const data = await anthropic.beta.tools.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: temperature || 0.5,
        tools,
        messages: [
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
        ],
    });

    if (!data) {
        throw new Error("Anthropic Claude Error");
    } else {
        if (data.stop_reason === "tool_use") {
            const toolUse = data.content[0];
            if (toolUse.name === "get_weather") {
                const { location, unit } = toolUse.input;
                const weatherResult = await getWeather(location, unit);
                console.log(weatherResult);
                const newData = await anthropic.beta.tools.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 4096,
                    temperature: temperature || 0.5,
                    tools,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "tool_result",
                                    tool_use_id: toolUse.id,
                                    content: weatherResult,
                                },
                            ],
                        },
                    ],
                });
                return newData?.content?.[0]?.text;
            }
        } else {
            return data?.content?.[0]?.text;
        }
    }
};
