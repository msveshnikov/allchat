import dotenv from "dotenv";
dotenv.config({ override: true });

const url = "https://api.deepinfra.com/v1/openai/chat/completions";

export const getTextInfra = async (prompt, temperature, model, apiKey) => {
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey || process.env.INFRA_KEY}`,
    });

    const data = {
        model,
        max_tokens: 4096,
        temperature: temperature || 0.5,
        messages: [{ role: "user", content: prompt }],
    };

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    const result = await response.json();
    return result?.choices[0].message.content;
};
