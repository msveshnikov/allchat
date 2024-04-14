import dotenv from "dotenv";
dotenv.config({ override: true });

const url = "https://api.textinfra.com/v1/generate";

export const getTextInfra = async (prompt, temperature, model, apiKey) => {
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey || process.env.INFRA_KEY}`,
    });

    const data = {
        model,
        max_tokens: 4096,
        temperature: temperature || 0.5,
        text: prompt,
    };

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    const result = await response.json();
    return result?.output;
};
