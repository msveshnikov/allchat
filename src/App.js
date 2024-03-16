import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, Grid } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        // mode: "dark",
        primary: {
            main: "#7986cb",
        },
        secondary: {
            main: "#e53935",
        },
        background: {
            default: "#000000",
            paper: "#121212",
        },
        text: {
            primary: "#ffffff",
            secondary: "#e0e0e0",
        },
    },
});

function App() {
    const [input, setInput] = useState("");
    const [temperature, setTemperature] = useState(0.5);
    const [textResponse, setTextResponse] = useState("");
    const [imageResponse, setImageResponse] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5000/interact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input, temperature }),
            });

            if (response.ok) {
                const data = await response.json();
                const newChatHistory = [...chatHistory, { user: input, assistant: data.textResponse }];
                setChatHistory(newChatHistory);
                setTextResponse(data.textResponse);
                setImageResponse(data.imageResponse);
                setInput("");
            } else {
                console.error("An error occurred while interacting with the models");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        // <ThemeProvider theme={darkTheme}>
        <Container maxWidth="md">
            <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Enter your input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Temperature"
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Box>{textResponse}</Box>
                    {imageResponse && (
                        <img src={`data:image/png;base64,${imageResponse.toString("base64")}`} alt="Model output" />
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        {chatHistory.map((chat, index) => (
                            <Box key={index}>
                                <Typography variant="subtitle1">You:</Typography>
                                <Typography>{chat.user}</Typography>
                                <Typography variant="subtitle1">Model:</Typography>
                                <ReactMarkdown>{chat.assistant}</ReactMarkdown>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Container>
        // </ThemeProvider>
    );
}

export default App;
