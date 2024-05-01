import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import sharp from "sharp";
import { handleToolCall, tools } from "./tools.js";
dotenv.config({ override: true });

const resizeImage = async (imageBase64, maxSize = 2 * 1024 * 1024) => {
    const image = sharp(Buffer.from(imageBase64, "base64"));
    const metadata = await image.metadata();

    if (metadata.size > maxSize) {
        const resizedBuffer = await image
            .resize({
                fit: "inside",
                withoutEnlargement: true,
                withMetadata: true,
            })
            .toBuffer();

        return resizedBuffer.toString("base64");
    } else {
        return imageBase64;
    }
};

export const getTextClaude = async (prompt, temperature, imageBase64, fileType, userId, model, apiKey, webTools) => {
    let anthropic;
    if (apiKey) {
        anthropic = new Anthropic({ apiKey });
    } else {
        anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });
        if (model?.includes("opus") || !model) {
            model = "claude-3-haiku-20240307";
        }
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
                                  data: await resizeImage(imageBase64),
                              },
                          },
                      ]
                    : []),
            ],
        },
    ];

    let data = await anthropic.beta.tools.messages.create({
        model,
        max_tokens: 4096,
        temperature: temperature || 0.5,
        tools: webTools ? tools : [],
        messages,
    });

    if (!data) {
        throw new Error("Claude Error");
    } else {
        let toolUses, toolResults, newMessages, newData;

        while (data.stop_reason === "tool_use") {
            toolUses = data.content.filter((block) => block.type === "tool_use");
            if (!toolUses.length) {
                return data?.content?.[0]?.text;
            }

            toolResults = await Promise.all(
                toolUses.map(async (toolUse) => {
                    const toolResult = await handleToolCall(toolUse.name, toolUse.input, userId);
                    return { tool_use_id: toolUse.id, content: toolResult };
                })
            );

            newMessages = [
                ...messages,
                { role: "assistant", content: data.content.filter((c) => c.type !== "text" || c.text) },
                { role: "user", content: toolResults.map((toolResult) => ({ type: "tool_result", ...toolResult })) },
            ];

            newData = await anthropic.beta.tools.messages.create({
                model,
                max_tokens: 4096,
                temperature: temperature || 0.5,
                tools: webTools ? tools : [],
                messages: newMessages,
            });

            data = newData;
        }

        return data?.content?.[0]?.text;
    }
};
