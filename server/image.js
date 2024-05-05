import { getTextClaude } from "./claude.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const getImage = async (prompt, imageModel) => {
    prompt = prompt.substring(0, 500);
    const translated = await getTextClaude("Translate sentences in brackets [] into English:\n[" + prompt + "]\n");
    if (translated) {
        prompt = translated;
    }

    console.log("Image Prompt: " + prompt);
    return getStabilityImage(prompt, imageModel);
};

export const getStabilityImage = async (prompt, imageModel) => {
    const json = await getRawImageJson(prompt, imageModel);
    return json?.artifacts?.[0]?.base64;
};

export const getRawImageJson = async (prompt, imageModel) => {
    imageModel = "stable-diffusion-xl-1024-v1-0";
    const response = await fetch(`https://api.stability.ai/v1/generation/${imageModel}/text-to-image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: process.env.STABILITY_KEY,
        },
        body: JSON.stringify({
            cfg_scale: 7,
            height: 64 * 12,
            width: 64 * 21,
            samples: 1,
            steps: 30,
            text_prompts: [
                {
                    text: prompt,
                    weight: 1,
                },
            ],
        }),
    });

    if (!response.ok) {
        console.error(`Stability AI error`);
        return null;
    }
    return response.json();
};
