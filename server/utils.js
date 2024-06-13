import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const torIPs = fs.readFileSync("./tor.txt").toString().split("\r\n");
const blacklistedCustomers = ["bramble"];

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const handlebarsOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve("templates"),
        defaultLayout: false,
    },
    viewPath: path.resolve("templates"),
    extName: ".html",
};

transporter.use("compile", hbs(handlebarsOptions));

const sendEmail = async (options) => {
    try {
        const info = await transporter.sendMail(options);
        console.log("Email sent: " + info.response);
    } catch (e) {
        console.error(e);
    }
};

export const sendWelcomeEmail = async (user) => {
    sendEmail({
        to: user.email,
        from: process.env.EMAIL,
        subject: "Welcome to AllChat!",
        template: "welcome",
        context: {
            name: user.email,
        },
    });
};

export const sendResetEmail = async (user, resetUrl) => {
    sendEmail({
        to: user.email,
        from: process.env.EMAIL,
        subject: "Password Reset Request",
        template: "reset",
        context: {
            resetUrl,
        },
    });
};

export const sendInviteEmail = async (email, model, customGPT, chatId, inviterProfileUrl, customGPTProfileUrl) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Invite to Chat",
        template: "invite",
        context: {
            model,
            customGPT: customGPT || "N/A",
            chatId,
            inviterProfileUrl,
            customGPTProfileUrl,
            chatUrl: `https://allchat.online/chat/${chatId}`,
        },
    };

    const base64ImageTags = [
        inviterProfileUrl.match(/data:image\/(png|jpeg|gif);base64,([^"]+)/),
        customGPTProfileUrl.match(/data:image\/(png|jpeg|gif);base64,([^"]+)/),
    ].filter(Boolean);

    if (base64ImageTags.length > 0) {
        const attachments = await Promise.all(
            base64ImageTags.map(async (match, index) => {
                if (match) {
                    const [, format, base64Data] = match;
                    const imageByte = Buffer.from(base64Data, "base64");
                    const imageName = `image-${index + 1}-${Date.now()}.${format}`;

                    if (index === 0) {
                        mailOptions.context.inviterProfileUrl = `cid:${imageName}`;
                    } else {
                        mailOptions.context.customGPTProfileUrl = `cid:${imageName}`;
                    }

                    return {
                        filename: imageName,
                        content: imageByte,
                        encoding: "base64",
                        cid: imageName,
                    };
                }
                return null;
            })
        );

        mailOptions.attachments = attachments.filter(Boolean);
    }

    sendEmail(mailOptions);
};

export const whiteListCountries = [
    // all paying countries so far
    "US",
    "CA",
    "GB",
    "AU",
    "IT",
    "AT",
    "CH",
    "FR",
    "NL",
    "ES",
    "DK",
    "PT",
    "DE",
    "SE",
    "JP",
    "NO",
];

export async function isCustomerBlacklisted(customerName) {
    for (const name of blacklistedCustomers) {
        if (customerName.toLowerCase().includes(name.toLowerCase())) {
            return true;
        }
    }
    return false;
}
