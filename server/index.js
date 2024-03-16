import express from "express";
import cors from "cors";
import { getTextGemini } from "./gemini.js";
import { getImageTitan } from "./aws.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/interact", async (req, res) => {
    const userInput = req.body.input;
    const temperature = req.body.temperature || 0.5;

    try {
        const textResponse = await getTextGemini(userInput, temperature);
        let imageResponse;
        if (userInput.includes("Paint")) {
            imageResponse = await getImageTitan(userInput, false, "amazon.titan-image-generator-v1");
        }

        res.json({ textResponse, imageResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while interacting with the Gemini Pro model" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./google.json";
