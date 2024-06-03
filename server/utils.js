import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const torIPs = fs.readFileSync("./tor.txt").toString().split("\r\n");

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
