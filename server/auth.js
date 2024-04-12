import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./model/User.js";

export const registerUser = async (email, password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, password: hashedPassword });
        await user.save();
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
