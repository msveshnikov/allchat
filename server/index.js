import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { getTextGemini } from "./gemini.js";
import { getImageTitan } from "./aws.js";
import hasPaintWord from "./paint.js";
import pdfParser from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import * as xlsx from "xlsx";
import { getTextClaude } from "./claude.js";
import promBundle from "express-prom-bundle";
import { authenticateUser, registerUser, verifyToken } from "./auth.js";
import mongoose from "mongoose";
import { User, countCharacters, countTokens, storeUsageStats } from "./model/User.js";
import { fetchPageContent, fetchSearchResults } from "./search.js";
import fs from "fs";
import path from "path";

const MAX_CONTEXT_LENGTH = 16000;
const MAX_SEARCH_RESULT_LENGTH = 3000;
export const ALLOWED_ORIGIN = ["https://allchat.online", "http://localhost:3000"];

const systemPrompt = `You are an AI assistant that interacts with the Gemini Pro 1.5 and Claude Haiku language models. Your capabilities include:

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
- Performing pre-Google searches to gather relevant information based on the user's query.

Your ultimate goal is to provide an excellent user experience by leveraging the capabilities of AI while adhering to ethical principles.`;

const metricsMiddleware = promBundle({
    metricType: "summary",
    includeMethod: true,
    includePath: true,
});

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: "50mb" }));
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
app.listen(5000, () => {
    console.log(`🚀 Server started on port 5000`);
});

export const MONGODB_URI =
    process.env.NODE_ENV === "production" ? "mongodb://mongodb:27017/allchat" : "mongodb://localhost:27017/allchat";

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("🚀 MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.post("/interact", verifyToken, async (req, res) => {
    let userInput = req.body.input;
    const chatHistory = req.body.chatHistory || [];
    const temperature = req.body.temperature || 0.8;
    const fileBytesBase64 = req.body.fileBytesBase64;
    const fileType = req.body.fileType;
    const numberOfImages = req.body.numberOfImages || 1;
    const model = req.body.model || "gemini";

    if (model === "claude" && !req.user.admin) {
        return res.status(401).json({ error: "Haiku is available only by request" });
    }

    try {
        if (fileBytesBase64) {
            const fileBytes = Buffer.from(fileBytesBase64, "base64");
            if (fileType === "png" || fileType === "jpg" || fileType === "jpeg" || fileType === "mp4") {
                const response =
                    model === "gemini"
                        ? await getTextGemini(userInput || "what's this", temperature, fileBytesBase64, fileType)
                        : await getTextClaude(userInput || "what's this", temperature, fileBytesBase64, fileType);
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

        let searchResults = [];
        let topResultContent = "";

        const urlRegex = /https?:\/\/[^\s]+/;
        const match = userInput?.match(urlRegex);
        if (match) {
            const url = match[0];
            const urlContent = await fetchPageContent(url);
            if (urlContent) {
                userInput = userInput.replace(url, `\n${urlContent.slice(0, MAX_SEARCH_RESULT_LENGTH)}\n`);
            }
        } else {
            if (userInput?.toLowerCase()?.includes("search") || userInput?.toLowerCase()?.includes("google")) {
                const searchQuery = userInput.replace(/search\s*|google\s*/gi, "").trim();
                searchResults = (await fetchSearchResults(searchQuery)) || [];
                topResultContent = searchResults.map((result) => result.title + " " + result.snippet).join("\n\n");
                for (let i = 0; i < 3 && i < searchResults.length; i++) {
                    const pageContent = await fetchPageContent(searchResults[i].link);
                    topResultContent += pageContent;
                    if (topResultContent.length > MAX_SEARCH_RESULT_LENGTH) {
                        break;
                    }
                    topResultContent = topResultContent.slice(0, MAX_SEARCH_RESULT_LENGTH);
                }
            }
        }

        const contextPrompt = `System: ${systemPrompt} 
            ${chatHistory.map((chat) => `Human: ${chat.user}\nAssistant:${chat.assistant}`).join("\n")}
            \n\nSearch Results:${topResultContent}\n\nHuman: ${userInput}\nAssistant:`.slice(-MAX_CONTEXT_LENGTH);

        let textResponse;
        let inputTokens = 0;
        let outputTokens = 0;
        let inputCharacters = 0;
        let outputCharacters = 0;
        let imagesGenerated = 0;

        if (model === "gemini") {
            inputCharacters = countCharacters(contextPrompt);
            textResponse = await getTextGemini(contextPrompt, temperature);
            outputCharacters = countCharacters(textResponse);
        } else if (model === "claude") {
            inputTokens = countTokens(contextPrompt);
            textResponse = await getTextClaude(contextPrompt, temperature);
            outputTokens = countTokens(textResponse);
        }

        if (searchResults?.length > 0) {
            textResponse += `\n\nSearch Results:\n${searchResults
                .map(
                    (result, index) =>
                        `${index + 1}. ${result.title}\n[${result.link}](${result.link})\n${result.snippet}\n`
                )
                .join("\n")}`;
        }

        userInput = userInput?.toLowerCase();
        let imageResponse;
        if (hasPaintWord(userInput)) {
            imageResponse = await getImageTitan(
                userInput?.substr(0, 200) + textResponse?.trim()?.substr(0, 200),
                numberOfImages
            );
            imagesGenerated = numberOfImages;
        }

        storeUsageStats(
            req.user.id,
            model,
            inputTokens,
            outputTokens,
            inputCharacters,
            outputCharacters,
            imagesGenerated
        );

        res.json({ textResponse: textResponse?.trim(), imageResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Model Returned Error: " + error.message,
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

app.get("/user", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude the password field
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/stats", verifyToken, async (req, res) => {
    if (!req.user.admin) {
        return res.status(401).json({ error: "This is admin only route" });
    }
    try {
        const users = await User.find({});
        const geminiStats = {
            totalInputCharacters: 0,
            totalOutputCharacters: 0,
            totalImagesGenerated: 0,
            totalMoneyConsumed: 0,
        };
        const claudeStats = {
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalMoneyConsumed: 0,
        };

        for (const user of users) {
            const { gemini, claude } = user.usageStats;

            geminiStats.totalInputCharacters += gemini.inputCharacters;
            geminiStats.totalOutputCharacters += gemini.outputCharacters;
            geminiStats.totalImagesGenerated += gemini.imagesGenerated;
            geminiStats.totalMoneyConsumed += gemini.moneyConsumed;

            claudeStats.totalInputTokens += claude.inputTokens;
            claudeStats.totalOutputTokens += claude.outputTokens;
            claudeStats.totalMoneyConsumed += claude.moneyConsumed;
        }

        res.json({ users: users.length, gemini: geminiStats, claude: claudeStats });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: error.message });
    }
});

const contentFolder = path.join(process.cwd(), "content");
if (!fs.existsSync(contentFolder)) {
    fs.mkdirSync(contentFolder, { recursive: true });
}

app.post("/run", verifyToken, async (req, res) => {
    try {
        const { program } = req.body;
        const pythonServerUrl =
            process.env.NODE_ENV === "production" ? "http://python-shell:8000" : "http://localhost:8000";
        const response = await fetch(pythonServerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: program,
        });
        const data = await response.text();

        if (response.ok) {
            const jsonData = JSON.parse(data);
            const output = jsonData.output;
            const newFiles = jsonData.new_files;

            let outputWithLinks = output;
            const imageResponse = [];

            for (const [filePath, base64Content] of Object.entries(newFiles)) {
                const fileName = path.basename(filePath);
                const fileExtension = path.extname(fileName).toLowerCase();

                if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
                    imageResponse.push(base64Content);
                } else {
                    const fileContent = Buffer.from(base64Content, "base64");
                    const fileSavePath = path.join(contentFolder, fileName);
                    fs.writeFileSync(fileSavePath, fileContent);
                    const hyperlink = `[${fileName}](/api/get?file=${encodeURIComponent(fileName)})`;
                    outputWithLinks += `\n${hyperlink}`;
                }
            }

            res.status(200).send({ output: outputWithLinks, imageResponse });
        } else {
            res.status(response.status).json({ error: data });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to execute Python code: " + error.message });
    }
});

app.get("/get", (req, res) => {
    const fileName = req.query.file;
    const filePath = path.join(contentFolder, fileName);

    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.status(200).send(fileContent);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});
