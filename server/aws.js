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

export const getImageTitan = async (prompt, numImages) => {
    try {
        const inferenceParams = {
            taskType: "TEXT_IMAGE",
            textToImageParams: {
                text: prompt,
            },
            imageGenerationConfig: {
                numberOfImages: numImages,
                quality: "premium",
                height: 384,
                width: 704,
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

        if (numImages === 1) {
            return responseBody.images[0];
        } else {
            return responseBody.images;
        }
    } catch (e) {
        console.error(e.message, `prompt:` + prompt);
        return null;
    }
};
