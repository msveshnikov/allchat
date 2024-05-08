import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { API_URL } from "./Main";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga4";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = ({ onAuthentication }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            setError(t("Please enter a valid email address."));
            return;
        }

        try {
            ReactGA.event({
                category: "user",
                action: isLogin ? "Login" : "SignUp",
            });
            const response = await fetch(
                `${API_URL}/${isLogin ? "login" : isPasswordReset ? "reset-password" : "register"}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                if (isLogin) {
                    onAuthentication(data.token, email);
                } else if (isPasswordReset) {
                    setIsPasswordReset(false);
                    setIsLogin(true);
                    setEmail("");
                    setPassword("");
                    setError("");
                    setSuccessMessage(t("Password reset successful. Please check email."));
                } else {
                    setIsLogin(true);
                    setEmail("");
                    setPassword("");
                    setError("");
                    setSuccessMessage(t("Registration successful. Please log in now."));
                }
            } else {
                setError(data.error);
                setSuccessMessage("");
            }
        } catch (error) {
            setError(t("An error occurred"));
            setSuccessMessage("");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setIsPasswordReset(false);
        setEmail("");
        setPassword("");
        setError("");
        setSuccessMessage("");
    };

    const togglePasswordReset = () => {
        setIsPasswordReset(!isPasswordReset);
        setIsLogin(false);
        setEmail("");
        setPassword("");
        setError("");
        setSuccessMessage("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
            <Typography variant="h4" gutterBottom>
                {isLogin ? t("Login") : isPasswordReset ? t("Reset Password") : t("Register")}
            </Typography>
            {error && (
                <Typography variant="body1" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            {successMessage && (
                <Typography variant="body1" color="success" gutterBottom>
                    {successMessage}
                </Typography>
            )}
            <form autoComplete="on" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={t("Email")}
                            value={email}
                            type="email"
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            error={!!error && error.includes("email")}
                            helperText={error && error.includes("email") ? error : ""}
                        />
                    </Grid>
                    {!isPasswordReset && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("Password")}
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth>
                            {isPasswordReset ? t("Reset") : isLogin ? t("Login") : t("Register")}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Button onClick={toggleMode} sx={{ mt: 2 }}>
                {isLogin
                    ? t("Don't have an account? Register")
                    : isPasswordReset
                    ? t("Back to Login")
                    : t("Already have an account? Login")}
            </Button>
            {!isPasswordReset && (
                <Button onClick={togglePasswordReset} sx={{ mt: 1 }}>
                    {t("Forgot Password?")}
                </Button>
            )}
        </Box>
    );
};

export default AuthForm;
