import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { getTextGemini } from "./gemini.js";
import { getImageTitan } from "./aws.js";

const MAX_CONTEXT_LENGTH = 4000;

const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const loggerFormat = ":method :url :status :response-time ms - :res[content-length] :body";
app.use(morgan(loggerFormat));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
});

app.use(limiter);
app.post("/interact", async (req, res) => {
    let userInput = req.body.input;
    const chatHistory = req.body.chatHistory || [];
    const temperature = req.body.temperature || 0.5;

    try {
        const contextPrompt = `${chatHistory
            .map((chat) => `${chat.user}\n${chat.assistant}`)
            .join("\n")}\n\nHuman: ${userInput}\nAssistant:`.slice(-MAX_CONTEXT_LENGTH);
        const textResponse = await getTextGemini(contextPrompt, temperature);
        userInput = userInput?.toLowerCase();
        let imageResponse;
        if (userInput.includes("paint") || userInput.includes("draw") || userInput.includes("generate")) {
            imageResponse = await getImageTitan(userInput + textResponse?.trim()?.substr(0, 200));
        }

        res.json({ textResponse: textResponse?.trim(), imageResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Gemini Pro Error",
        });
    }
});

app.listen(5000);

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./google.json";
