import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./model/User.js";
import { sendEmail, sendWelcomeEmail } from "./utils.js";

export const resetPassword = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, error: "Email not found" };
        }

        const token = jwt.sign(
            {
                userId: user._id,
                reset: true,
            },
            process.env.JWT_TOKEN,
            { expiresIn: "1h" }
        );

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: "Password Reset Request",
            template: "reset",
            context: {
                resetUrl,
            },
        };

        await sendEmail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Password reset error:", error);
        return { success: false, error: "Password reset failed" };
    }
};

export const completePasswordReset = async (token, password) => {
    try {
        token = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ _id: token.userId });
        if (!token.reset || !user) {
            return { success: false, error: "Invalid or expired token" };
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Password reset completion error:", error);
        return { success: false, error: "Password reset failed" };
    }
};

export const getIpFromRequest = (req) => {
    let ips = (req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "").split(
        ","
    );
    return ips[0].trim();
};

export const registerUser = async (email, password, req) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            email,
            password: hashedPassword,
            userAgent: req.headers["user-agent"],
            ip: getIpFromRequest(req),
        });
        await user.save();
        sendWelcomeEmail(user);
        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Registration failed" };
    }
};

export const authenticateUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, error: "Invalid email or password" };
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return { success: false, error: "Invalid email or password" };
        }
        const token = jwt.sign({ userId: user._id, admin: user.admin }, process.env.JWT_TOKEN, { expiresIn: "720h" });
        return { success: true, token };
    } catch (error) {
        console.error("Authentication error:", error);
        return { success: false, error: "Authentication failed" };
    }
};

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = {
            id: decoded.userId,
            admin: decoded.admin,
        };
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};
