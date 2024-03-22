import * as React from "react"; 
import { useState } from "react"; 
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { API_URL } from "./App";

const AuthForm = ({ onAuthentication }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    // Store the JWT token in localStorage or React context
                    localStorage.setItem("token", data.token);
                    onAuthentication(data.token); // Call the onAuthentication prop function
                } else {
                    // Handle successful registration
                    console.log("Registration successful");
                }
            } else {
                // Handle error
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
            <Typography variant="h4" gutterBottom>
                {isLogin ? "Login" : "Register"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal" // Added for spacing
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
