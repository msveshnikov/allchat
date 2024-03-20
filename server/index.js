import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { getTextGemini } from "./gemini.js";
import { getImageTitan } from "./aws.js";
import hasPaintWord from "./paint.js";
import pdfParser from "pdf-parse";
import mammoth from "mammoth";
import * as xlsx from "xlsx";

const MAX_CONTEXT_LENGTH = 8000;
const systemPrompt = `You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest. You can speak any language and respond to user on his preferred one. Your responses should be informative, insightful, and relevant to the given context. You should tailor your responses based on the user's query and provide meaningful and engaging information. When applicable, you can use examples, analogies, or visual aids to enhance your explanations. However, you should avoid generating or sharing any explicit, offensive, or harmful content. If the user's query is ambiguous or unclear, you should politely ask for clarification before responding. Your ultimate goal is to provide an excellent user experience while adhering to ethical principles.`;

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "10mb" }));

morgan.token("body", (req, res) => {
    const body = req.body;
    if (body && typeof body === "object") {
        const clonedBody = { ...body };
        if ("fileBytesBase64" in clonedBody) {
            clonedBody.fileBytesBase64 = "<FILE_BYTES_REDACTED>";
        }
        if ("chatHistory" in clonedBody) {
            clonedBody.chatHistory = "<CHAT_HISTORY_REDACTED>";
        }
        return JSON.stringify(clonedBody);
    }
    return JSON.stringify(body);
});

const loggerFormat = ":method :url :status :response-time ms - :res[content-length] :body";
app.use(morgan(loggerFormat));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

app.use(limiter);

app.post("/interact", async (req, res) => {
    let userInput = req.body.input;
    const chatHistory = req.body.chatHistory || [];
    const temperature = req.body.temperature || 0.8;
    const fileBytesBase64 = req.body.fileBytesBase64;
    const fileType = req.body.fileType;

    try {
        if (fileBytesBase64) {
            const fileBytes = Buffer.from(fileBytesBase64, "base64");
            if (fileType === "pdf") {
                const data = await pdfParser(fileBytes);
                userInput = `${data.text}\n\n${userInput}`;
            } else if (
                fileType === "msword" ||
                fileType === "vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                const docResult = await mammoth.extractRawText({ buffer: fileBytes });
                userInput = `${docResult.value}\n\n${userInput}`;
            } else if (fileType === "xlsx" || fileType === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                const workbook = xlsx.read(fileBytes, { type: "buffer" });
                const sheetNames = workbook.SheetNames;
                let excelText = "";
                sheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    excelText += xlsx.utils.sheet_to_txt(worksheet);
                });
                userInput = `${excelText}\n\n${userInput}`;
            } else {
                console.error("Unsupported file type");
                return res.status(400).json({ error: "Unsupported file type" });
            }
        }

        const contextPrompt = `System: ${systemPrompt} ${chatHistory
            .map((chat) => `Human: ${chat.user}\nAssistant:${chat.assistant}`)
            .join("\n")}\n\nHuman: ${userInput}\nAssistant:`.slice(-MAX_CONTEXT_LENGTH);
        const textResponse = await getTextGemini(contextPrompt, temperature);
        userInput = userInput?.toLowerCase();
        let imageResponse;
        if (hasPaintWord(userInput)) {
            imageResponse = await getImageTitan(userInput?.substr(0, 200) + textResponse?.trim()?.substr(0, 200));
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

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./allchat.json";
