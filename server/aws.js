import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
dotenv.config({ override: true });

const bedrock = new BedrockRuntime({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: "us-east-1",
});

export const getImageTitan = async (prompt, vertical) => {
    try {
        const inferenceParams = {
            taskType: "TEXT_IMAGE",
            textToImageParams: {
                text: prompt,
            },
            imageGenerationConfig: {
                numberOfImages: 1,
                quality: "premium",
                height: vertical ? 704 : 384,
                width: vertical ? 384 : 704,
                cfgScale: 7.0,
                seed: Math.round(Math.random() * 100000),
            },
        };

        const response = await bedrock.invokeModel({
            modelId: "amazon.titan-image-generator-v1",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(inferenceParams),
        });

        const responseBody = JSON.parse(response.body.transformToString());

        return responseBody.images[0];
    } catch (e) {
        console.error(e.message, `prompt:` + prompt);
        return null;
    }
};
