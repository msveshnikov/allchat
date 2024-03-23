import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { getTextGemini, getTextVision } from "./gemini.js";
import { getImageTitan } from "./aws.js";
import hasPaintWord from "./paint.js";
import pdfParser from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import * as xlsx from "xlsx";
import { getTextClaude } from "./claude.js";
import promBundle from "express-prom-bundle";
import { authenticateUser, registerUser, verifyToken } from "./auth.js";

const MAX_CONTEXT_LENGTH = 8000;
const systemPrompt = `You are an AI assistant that interacts with the Gemini Pro and Claude Haiku language models. Your capabilities include:

- Engaging in natural language conversations and answering user queries.
- Providing informative, insightful, and relevant responses based on the given context and user input.
- Tailoring your responses based on the user's query and providing meaningful and engaging information.
- Using examples, analogies, or visual aids to enhance your explanations when applicable.
- Supporting file uploads and integrating content from PDFs, Word documents, and Excel spreadsheets into the conversation.
- Rendering Markdown formatting in your responses for better readability.
- Generating images based on text descriptions using the Amazon Titan image generation model.
- If user request picture generation, you do NOT generate ASCII but provide detail scene description like for MidJourney.
- Asking for clarification if the user's query is ambiguous or unclear.
- Your context size is 200.000

Your ultimate goal is to provide an excellent user experience by leveraging the capabilities of AI while adhering to ethical principles.`;

const metricsMiddleware = promBundle({
    metricType: "summary",
    includeMethod: true,
    includePath: true,
});

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(metricsMiddleware);

morgan.token("body", (req, res) => {
    const body = req.body;
    if (body && typeof body === "object") {
        const clonedBody = { ...body };
        if ("fileBytesBase64" in clonedBody) {
            clonedBody.fileBytesBase64 = "<FILE_BYTES_REDACTED>";
        }
        if ("password" in clonedBody) {
            clonedBody.password = "<PASSWORD_REDACTED>";
        }
        // if ("chatHistory" in clonedBody) {
        //     clonedBody.chatHistory = "<CHAT_HISTORY_REDACTED>";
        // }
        return JSON.stringify(clonedBody);
    }
    return JSON.stringify(body);
});

const loggerFormat = ":method :url :status :response-time ms - :res[content-length] :body";
app.use(morgan(loggerFormat));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
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
    const model = req.body.model || "gemini";

    try {
        if (fileBytesBase64) {
            const fileBytes = Buffer.from(fileBytesBase64, "base64");
            if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
                const response = await getTextVision(userInput || "what's this", fileBytesBase64, temperature);
                return res.json({ textResponse: response?.trim() });
            } else if (fileType === "pdf") {
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

        let textResponse;
        if (model === "gemini") {
            textResponse = await getTextGemini(contextPrompt, temperature);
        } else if (model === "claude") {
            textResponse = await getTextClaude(contextPrompt, "claude-3-haiku-20240307", temperature);
        }

        userInput = userInput?.toLowerCase();
        let imageResponse;
        if (hasPaintWord(userInput)) {
            imageResponse = await getImageTitan(userInput?.substr(0, 200) + textResponse?.trim()?.substr(0, 200));
        }

        res.json({ textResponse: textResponse?.trim(), imageResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Model Returned Error",
        });
    }
});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    if (result.success) {
        res.status(200).json({ message: "Registration successful" });
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await authenticateUser(email, password);
    if (result.success) {
        res.status(200).json({ token: result.token });
    } else {
        res.status(401).json({ error: result.error });
    }
});

app.listen(5000, () => {
    console.log(`🚀 Server started on port 5000`);
});
