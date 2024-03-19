import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { getTextGemini } from "./gemini.js";
import { getImageTitan } from "./aws.js";
import hasPaintWord from "./paint.js";
import pdfParser from "pdf-parse";

const MAX_CONTEXT_LENGTH = 8000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

morgan.token("body", (req, res) => {
    const body = req.body;
    if (body && typeof body === "object" && "pdfBytesBase64" in body) {
        const clonedBody = { ...body };
        clonedBody.pdfBytesBase64 = "<PDF_BYTES_REDACTED>";
        return JSON.stringify(clonedBody);
    }
    return JSON.stringify(body);
});

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
    const pdfBytesBase64 = req.body.pdfBytesBase64;

    try {
        if (pdfBytesBase64) {
            const pdfBytes = Buffer.from(pdfBytesBase64, "base64");
            const data = await pdfParser(pdfBytes);
            userInput = data.text;
        }

        const contextPrompt = `${chatHistory
            .map((chat) => `${chat.user}\n${chat.assistant}`)
            .join("\n")}\n\nHuman: ${userInput}\nAssistant:`.slice(-MAX_CONTEXT_LENGTH);
        const textResponse = await getTextGemini(contextPrompt, temperature);
        userInput = userInput?.toLowerCase();
        let imageResponse;
        if (hasPaintWord(userInput)) {
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

app.listen(5000, () => {
    console.log(`🚀 Server started on port 5000`);
});

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./google.json";
