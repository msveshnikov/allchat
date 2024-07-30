import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./model/User.js";
import { sendResetEmail, sendWelcomeEmail } from "./utils.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        await sendResetEmail(user, resetUrl);
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

export const registerUser = async (email, password, credential, req) => {
    try {
        const country = req.headers["geoip_country_code"];
        const ip = getIpFromRequest(req);
        let subscriptionStatus = "none";
        let user;
        if (credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);
            const profile = verificationResponse?.payload;
            console.log("email", profile?.email);
            if (verificationResponse.error || !profile) {
                return { success: false, error: verificationResponse.error };
            }
            user = await createOrUpdateUser(profile, req, ip, country);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({
                email,
                password: hashedPassword,
                userAgent: req.headers["user-agent"],
                ip,
                country,
                subscriptionStatus,
            });
            await user.save();
            await sendWelcomeEmail(user);
        }
        const token = jwt.sign({ userId: user._id, admin: user.admin }, process.env.JWT_TOKEN, { expiresIn: "720h" });
        return { success: true, token };
    } catch (error) {
        console.error("Registration error:", error.message);
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
        console.error("Authentication error:", error.message);
        return { success: false, error: "Authentication failed" };
    }
};

export const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }
};

export const createOrUpdateUser = async (profile, req, ip, country) => {
    const update = {
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        profileUrl: profile.picture,
        userAgent: req.headers["user-agent"],
        ip,
        country,
    };
    let user = await User.findOne({
        email: {
            $regex: profile.email,
            $options: "i",
        },
    });
    if (!user) {
        update.password = "external";
        user = await User.create(update);
        await sendWelcomeEmail(user);
    } else {
        if (user?.profileUrl) {
            delete update.profileUrl;
        }
        user = await User.findOneAndUpdate({ email: profile.email }, update);
    }
    return user;
};

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
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
