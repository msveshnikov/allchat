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

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
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
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return { success: false, error: "Invalid or expired token" };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Password reset completion error:", error);
        return { success: false, error: "Password reset failed" };
    }
};

export const registerUser = async (email, password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, password: hashedPassword });
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
