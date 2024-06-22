import OpenAI from "openai";
import { handleToolCall, tools } from "./tools.js";
import { renameProperty } from "./gemini.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const getTextGpt = async (prompt, temperature, fileBytesBase64, fileType, userId, model, webTools) => {
    if (!fileType && userId !== "65fe9b2dedac81e8fa3c19bc") {
        model = "gpt-3.5-turbo";
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    const openAiTools = tools.map(renameProperty).map((f) => ({ type: "function", function: f }));
    const messages = [
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                ...(fileType && fileBytesBase64
                    ? [
                          {
                              type: "image_url",
                              image_url: {
                                  url: `data:${
                                      fileType === "png" ? "image/png" : "image/jpeg"
                                  };base64,${fileBytesBase64}`,
                              },
                          },
                      ]
                    : []),
            ],
        },
    ];

    const getResponse = async () => {
        const completion = await openai.chat.completions.create({
            model: model || "gpt-3.5-turbo",
            max_tokens: 2048,
            messages,
            temperature: temperature || 0.7,
            tools: webTools ? openAiTools : null,
        });
        return completion?.choices?.[0]?.message;
    };

    let response = await getResponse();
    let iterationCount = 0;
    while (response?.tool_calls && iterationCount < 5) {
        const toolCalls = response?.tool_calls;
        messages.push(response);
        for (const toolCall of toolCalls) {
            const toolResult = await handleToolCall(
                toolCall.function.name,
                JSON.parse(toolCall.function.arguments),
                userId
            );
            messages.push({
                role: "tool",
                name: toolCall.name,
                tool_call_id: toolCall.id,
                content: toolResult,
            });
        }
        response = await getResponse();
        iterationCount++;
    }
    return response?.content;
};
