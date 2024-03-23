import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { API_URL } from "./App";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = ({ onAuthentication }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email validation
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${isLogin ? "login" : "register"}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                if (isLogin) {
                    onAuthentication(data.token); 
                } else {
                    setIsLogin(true); // Transition to login form after successful registration
                    setEmail("");
                    setPassword("");
                    setError("");
                    setSuccessMessage("Registration successful. Please log in now."); // Set success message
                }
            } else {
                setError(data.error);
                setSuccessMessage(""); 
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred"); 
            setSuccessMessage("");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
        setError(""); 
        setSuccessMessage(""); 
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
            <Typography variant="h4" gutterBottom>
                {isLogin ? "Login" : "Register"}
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
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            error={!!error && error.includes("email")} // Highlight the email field if the error message includes "email"
                            helperText={error && error.includes("email") ? error : ""} // Display the error message as helper text
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth>
                            {isLogin ? "Login" : "Register"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Button onClick={toggleMode} sx={{ mt: 2 }}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Button>
        </Box>
    );
};

export default AuthForm;
