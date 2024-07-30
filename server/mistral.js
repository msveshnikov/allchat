import MistralClient from "@mistralai/mistralai";
import dotenv from "dotenv";
import { handleToolCall, tools } from "./tools.js";
import { renameProperty } from "./gemini.js";
dotenv.config({ override: true });

const apiKey = process.env.MISTRAL_KEY;
const client = new MistralClient(apiKey);

export const getTextMistralLarge = async (prompt, temperature, userId, model, webTools) => {
    const openAiTools = tools.map(renameProperty).map((f) => ({ type: "function", function: f }));
    const messages = [{ role: "user", content: prompt }];

    const getResponse = async () => {
        const completion = await client.chat({
            model: model,
            max_tokens: 4096,
            messages,
            temperature: webTools ? 0 : temperature || 0.5,
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
