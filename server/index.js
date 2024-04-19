import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hasPaintWord from "./paint.js";
import pdfParser from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import promBundle from "express-prom-bundle";
import mongoose from "mongoose";
import * as xlsx from "xlsx";
import { getTextGemini } from "./gemini.js";
import { getTextClaude } from "./claude.js";
import { getImageTitan } from "./aws.js";
import { getTextTogether } from "./together.js";
import { getTextInfra } from "./deepinfra.js";
import { authenticateUser, completePasswordReset, registerUser, resetPassword, verifyToken } from "./auth.js";
import { User, countTokens, storeUsageStats } from "./model/User.js";
import CustomGPT from "./model/CustomGPT.js";
import { fetchPageContent, fetchSearchResults } from "./search.js";
import fs from "fs";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config({ override: true });

const MAX_CONTEXT_LENGTH = 16000;
const MAX_SEARCH_RESULT_LENGTH = 3000;
export const ALLOWED_ORIGIN = ["https://allchat.online", "http://localhost:3000"];
const stripe = new Stripe(process.env.STRIPE_KEY);
const systemPrompt = `You are an AI assistant that interacts with the Gemini Pro 1.5 and Claude Haiku language models. Your capabilities include:

- Engaging in natural language conversations and answering user queries.
- Providing informative, insightful, and relevant responses based on the given context and user input.
- Tailoring your responses based on the user's query and providing meaningful and engaging information.
- Using examples, analogies, or visual aids to enhance your explanations when applicable.
- Supporting file uploads and integrating content from PDFs, Word documents, and Excel spreadsheets into the conversation.
- Rendering Markdown formatting in your responses for better readability.
- Generating images based on text descriptions using the Amazon Titan image generation model.
- If user request picture generation, you DO NOT generate ASCII but provide detail scene description like for MidJourney.
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
app.use((req, res, next) => {
    if (req.originalUrl === "/stripe-webhook") {
        next();
    } else {
        express.json({ limit: "100mb" })(req, res, next);
    }
});
app.use(cors({ origin: ALLOWED_ORIGIN }));
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
        if ("files" in clonedBody) {
            clonedBody.files = "<FILES_REDACTED>";
        }
        if ("apiKey" in clonedBody) {
            clonedBody.apiKey = "<APIKEY_REDACTED>";
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
    const tools = req.body.tools;
    const lang = req.body.lang;
    const model = req.body.model || "gemini-1.5-pro-latest";
    const customGPT = req.body.customGPT;
    const apiKey = req.body.apiKey;
    const country = req.headers["geoip_country_code"];

    // const user = await User.findById(req.user.id);
    // if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing' && !user.admin && !apiKey) {
    //     return res.status(402).json({ error: 'Subscription is not active. Please provide your API key in Settings.' });
    // }

    try {
        if (fileBytesBase64) {
            const fileBytes = Buffer.from(fileBytesBase64, "base64");
            if (
                fileType === "png" ||
                fileType === "jpg" ||
                fileType === "jpeg" ||
                fileType === "mp4" ||
                fileType === "mp3" ||
                fileType === "mpeg" ||
                fileType === "x-m4a"
            ) {
                let textResponse;
                if (model?.startsWith("gemini")) {
                    textResponse = await getTextGemini(
                        userInput || "what's this",
                        temperature,
                        fileBytesBase64,
                        fileType,
                        req.user.id,
                        model,
                        apiKey,
                        tools
                    );
                }
                if (model?.startsWith("claude")) {
                    textResponse = await getTextClaude(
                        userInput || "what's this",
                        temperature,
                        fileBytesBase64,
                        fileType,
                        req.user.id,
                        model,
                        apiKey,
                        tools
                    );
                }
                return res.json({ textResponse });
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

        let instructions = "";
        if (customGPT) {
            const GPT = await CustomGPT.findOne({ name: customGPT });
            if (GPT) {
                instructions = GPT.knowledge + "\n\n" + GPT.instructions;
            }
        }

        const contextPrompt = `System: ${instructions || systemPrompt} User country code: ${country} User Lang: ${lang}
            ${chatHistory.map((chat) => `Human: ${chat.user}\nAssistant:${chat.assistant}`).join("\n")}
            \n\nSearch Results:${topResultContent}\n\nHuman: ${userInput}\nAssistant:`.slice(-MAX_CONTEXT_LENGTH);

        let textResponse;
        let inputTokens = 0;
        let outputTokens = 0;
        let imagesGenerated = 0;

        inputTokens = countTokens(contextPrompt);
        if (model?.startsWith("gemini")) {
            textResponse = await getTextGemini(
                contextPrompt,
                temperature,
                null,
                null,
                req.user.id,
                model,
                apiKey,
                tools
            );
        } else if (model?.startsWith("claude")) {
            textResponse = await getTextClaude(
                contextPrompt,
                temperature,
                null,
                null,
                req.user.id,
                model,
                apiKey,
                tools
            );
        } else if (model?.startsWith("HuggingFace")) {
            textResponse = await getTextInfra(contextPrompt, temperature, model, apiKey);
        } else {
            textResponse = await getTextTogether(contextPrompt, temperature, model, apiKey);
        }
        outputTokens = countTokens(textResponse);

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
                userInput?.substr(0, 200) + textResponse?.substr(0, 300),
                numberOfImages
            );
            imagesGenerated = numberOfImages;
        }

        storeUsageStats(req.user.id, model, inputTokens, outputTokens, imagesGenerated);

        res.json({ textResponse, imageResponse });
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

app.post("/reset-password", async (req, res) => {
    const { email } = req.body;
    const result = await resetPassword(email);
    if (result.success) {
        res.status(200).json({ message: "Password reset link sent" });
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const result = await completePasswordReset(token, password);
    if (result.success) {
        res.status(200).json({ message: "Password reset successful" });
    } else {
        res.status(400).json({ error: result.error });
    }
});

app.get("/user", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
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
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalMoneyConsumed: 0,
            totalImagesGenerated: 0,
        };
        const claudeStats = {
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalMoneyConsumed: 0,
        };

        for (const user of users) {
            const { gemini, claude } = user.usageStats;
            geminiStats.totalInputTokens += gemini.inputTokens;
            geminiStats.totalOutputTokens += gemini.outputTokens;
            geminiStats.totalMoneyConsumed += gemini.moneyConsumed;
            geminiStats.totalImagesGenerated += gemini.imagesGenerated;
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

app.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WH_SECRET);
        console.log("✅ Success:", event.id);
        switch (event.type) {
            case "customer.subscription.updated":
            case "customer.subscription.created":
                const subscription = event.data.object;
                await handleSubscriptionUpdate(subscription);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.send();
    } catch (err) {
        console.error(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

async function handleSubscriptionUpdate(subscription) {
    console.log(subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    const user = await User.findOne({ email: customer.email });
    if (!user) {
        console.error("User not found");
        return;
    }
    if (subscription.status === "active") {
        user.subscriptionStatus = "active";
    } else if (subscription.status === "trialing") {
        user.subscriptionStatus = "trialing";
    } else if (subscription.status === "past_due") {
        user.subscriptionStatus = "past_due";
    } else if (subscription.status === "canceled") {
        user.subscriptionStatus = "canceled";
    }
    user.subscriptionId = subscription.id;
    await user.save();
}

app.post("/cancel", verifyToken, async (req, res) => {
    const { subscriptionId } = req.body;
    try {
        await stripe.subscriptions.cancel(subscriptionId);
        const userId = req.user.id;
        const user = await User.findById(userId);
        user.subscriptionStatus = "canceled";
        await user.save();
        res.status(200).json({ message: "Subscription canceled successfully" });
    } catch (error) {
        console.error("Error canceling subscription:", error);
        res.status(500).json({ error: "Failed to cancel subscription" });
    }
});

app.post("/customgpt", async (req, res) => {
    const { name, instructions, files } = req.body;
    let knowledge = "";
    const maxSize = 60000;
    try {
        if (files && files.length > 0) {
            for (const file of files) {
                const fileType = file.split(";")[0].split("/")[1];
                const fileBytesBase64 = file.split(",")[1];
                const fileBytes = Buffer.from(fileBytesBase64, "base64");

                if (fileType === "pdf") {
                    const data = await pdfParser(fileBytes);
                    knowledge += `${data.text}\n\n`;
                } else if (
                    fileType === "msword" ||
                    fileType === "vnd.openxmlformats-officedocument.wordprocessingml.document"
                ) {
                    const docResult = await mammoth.extractRawText({ buffer: fileBytes });
                    knowledge += `${docResult.value}\n\n`;
                } else if (
                    fileType === "xlsx" ||
                    fileType === "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ) {
                    const workbook = xlsx.read(fileBytes, { type: "buffer" });
                    const sheetNames = workbook.SheetNames;
                    let excelText = "";
                    sheetNames.forEach((sheetName) => {
                        const worksheet = workbook.Sheets[sheetName];
                        excelText += xlsx.utils.sheet_to_text(worksheet);
                    });
                    knowledge += `${excelText}\n\n`;
                } else {
                    console.error("Unsupported file type");
                    return res.status(400).json({ error: "Unsupported file type" });
                }

                if (knowledge?.length > maxSize) {
                    return res.status(413).json({ error: "Maximum context size exceeded" });
                }
            }
        }

        // Check if a CustomGPT instance with the same name already exists
        const existingCustomGPT = await CustomGPT.findOne({ name });

        if (existingCustomGPT) {
            // Update the existing CustomGPT instance
            existingCustomGPT.instructions = instructions;
            existingCustomGPT.knowledge = knowledge;
            await existingCustomGPT.save();
            res.json({
                message: "CustomGPT updated successfully. You can select it in the Settings.",
                currentSize: knowledge?.length,
            });
        } else {
            // Create a new CustomGPT instance
            const newCustomGPT = new CustomGPT({
                name,
                instructions,
                knowledge,
            });
            await newCustomGPT.save();
            res.json({
                message: "CustomGPT saved successfully. You can select it in the Settings.",
                currentSize: knowledge?.length,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/customgpt", async (req, res) => {
    try {
        const customGPTs = await CustomGPT.find({}, { name: 1, _id: 0 });
        const names = [...new Set(customGPTs.map((customGPT) => customGPT.name))];
        res.json(names);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

process.on("uncaughtException", (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});
