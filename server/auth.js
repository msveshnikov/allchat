import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const MONGODB_URI =
    process.env.NODE_ENV === "production" ? "mongodb://mongo-db:27017/allchat" : "mongodb://localhost:27017/allchat";

// MongoDB connection
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// User model
const User = mongoose.model("User", userSchema);

// Register a new user
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

// Authenticate a user
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
        const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "1h",
        });
        return { success: true, token };
    } catch (error) {
        console.error("Authentication error:", error);
        return { success: false, error: "Authentication failed" };
    }
};
