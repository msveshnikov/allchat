import OpenAI from "openai";
import { handleToolCall, tools } from "./tools.js";
import { renameProperty } from "./gemini.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const getTextTogether = async (prompt, temperature, userId, model, webTools) => {
    const openai = new OpenAI({
        apiKey: process.env.TOGETHER_KEY,
        baseURL: "https://api.together.xyz/v1",
    });
    const openAiTools = tools.map(renameProperty).map((f) => ({ type: "function", function: f }));
    const messages = [{ role: "user", content: prompt }];

    const getResponse = async () => {
        const completion = await openai.chat.completions.create({
            model: model,
            max_tokens: 4096,
            messages,
            temperature: temperature || 0.5,
            tools: webTools ? openAiTools : null,
        });
        return completion?.choices?.[0]?.message;
    };

    let response = await getResponse();
    while (response?.tool_calls) {
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
    }
    return response?.content;
};
