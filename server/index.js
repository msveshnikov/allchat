import express from "express";
import cors from "cors";
import morgan from "morgan"; // Import morgan
import rateLimit from "express-rate-limit"; // Import express-rate-limit
import { getTextGemini } from "./gemini.js";
import { getImageTitan } from "./aws.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const loggerFormat = ":method :url :status :response-time ms - :res[content-length] :body";
app.use(morgan(loggerFormat));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many requests from this IP, please try again after a minute",
});

app.use(limiter);
app.post("/interact", async (req, res) => {
    let userInput = req.body.input;
    const chatHistory = req.body.chatHistory || [];
    const temperature = req.body.temperature || 0.5;

    try {
        const contextPrompt = `${chatHistory
            .map((chat) => `${chat.user}\n${chat.assistant}`)
            .join("\n")}\n\nHuman: ${userInput}\nAssistant:`;
        const textResponse = await getTextGemini(contextPrompt, temperature);
        userInput = userInput?.toLowerCase();
        let imageResponse;
        if (userInput.includes("paint") || userInput.includes("draw") || userInput.includes("generate")) {
            imageResponse = await getImageTitan(textResponse?.trim()?.substr(0, 200) ?? userInput);
        }

        res.json({ textResponse: textResponse?.trim(), imageResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while interacting with the Gemini Pro model",
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./google.json";
