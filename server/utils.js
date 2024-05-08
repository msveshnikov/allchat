import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
dotenv.config();

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
    "ES",
    "PT",
    "AT",
    "FR",
    "IT",
    "CH",
    "DE",
    "QA",
    "SA",
    "AE",
    "KW",
    "PL",
    "SE",
    "JP",
    "DK",
    "AU",
    "NL",
    "IL",
    "NO",
];
