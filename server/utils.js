import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
dotenv.config();

const blacklistedCustomers = ["bramble", "jemon", "max g"];

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

export const sendEmail = async (options) => {
    try {
        const info = await transporter.sendMail(options);
        console.log("Email sent: " + info.response);
    } catch (e) {
        console.error(e);
    }
};

export const sendWelcomeEmail = (user) => {
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
    "SG",
    "HK",
];

export const blackListCountries = [
    // countries which never pay, SDN list, Africa
    "IN",
    "PK",
    "CN",
    "BR",
    "AF",
    "SS",
    "BD",
    "AM",
    "IR",
    "IQ",
    "SY",
    "AZ",
    "KP",
    "CU",
    "VE",
    "SD",
    "ZW",
    "MM",
    "NG",
    "DZ",
    "AO",
    "BJ",
    "BW",
    "BF",
    "BI",
    "CM",
    "CV",
    "CF",
    "TD",
    "KM",
    "CG",
    "CD",
    "DJ",
    "EG",
    "GQ",
    "ER",
    "SZ",
    "ET",
    "GA",
    "LY",
    "GM",
];

export async function isCustomerNameBlacklisted(customerName) {
    for (const name of blacklistedCustomers) {
        if (customerName.toLowerCase().includes(name.toLowerCase())) {
            return true;
        }
    }
    return false;
}
