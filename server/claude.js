import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
dotenv.config({ override: true });

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_KEY,
});

export const getTextClaude = async (prompt, temperature, imageBase64, fileType) => {
    const data = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: temperature || 0.5,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
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
        return data?.content?.[0]?.text;
    }
};
