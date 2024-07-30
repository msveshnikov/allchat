import { getTextClaude } from "./claude.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const getImage = async (prompt, avatar) => {
    prompt = prompt.substring(0, 700);
    const translated = await getTextClaude(
        avatar ? prompt : "Translate sentences in brackets [] into English:\n[" + prompt + "]\n"
    );
    if (translated) {
        prompt = translated;
    }

    console.log("Image Prompt: " + prompt);
    return getStabilityImage(prompt, avatar);
};

export const getStabilityImage = async (prompt, avatar) => {
    const json = await getRawImageJson(prompt, avatar);
    return json?.artifacts?.[0]?.base64;
};

export const getRawImageJson = async (prompt, avatar) => {
    const imageModel = "stable-diffusion-xl-1024-v1-0";
    const response = await fetch(`https://api.stability.ai/v1/generation/${imageModel}/text-to-image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: process.env.STABILITY_KEY,
        },
        body: JSON.stringify({
            cfg_scale: 7,
            height: avatar ? 1024 : 64 * 12,
            width: avatar ? 1024 : 64 * 21,
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
