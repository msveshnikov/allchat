import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const getTextReplicate = async (prompt, temperature, model, apiKey) => {
    const replicate = new Replicate({ auth: apiKey || process.env.REPLICATE_KEY });
    const input = {
        prompt: prompt,
        max_length: 8192,
        temperature: temperature || 0.5,
    };

    const output = await replicate.run(
        "lucataco/phi-3-mini-128k-instruct:45ba1bd0a3cf3d5254becd00d937c4ba0c01b13fa1830818f483a76aa844205e",
        { input }
    );
    return output.join("").replace(".<|end|>", "");
};
