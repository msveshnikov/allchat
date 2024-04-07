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
                height: 384*2,
                width: 704*2,
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

const textDecoder = new TextDecoder("utf-8");
export const getTextClaude = async (prompt, model, temperature) => {
    const params = {
        modelId: model,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            prompt: `\n\nHuman:\n  ${prompt}\n\nAssistant:\n`,
            max_tokens_to_sample: 2048,
            temperature: temperature || 0.5,
            top_k: 250,
            top_p: 1,
            stop_sequences: ["\\n\\nHuman:"],
        }),
    };

    const data = await bedrock.invokeModel(params);

    if (!data) {
        throw new Error("AWS Bedrock Claude Error");
    } else {
        const response_body = JSON.parse(textDecoder.decode(data.body));
        return response_body.completion;
    }
};
