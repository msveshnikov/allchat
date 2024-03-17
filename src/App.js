import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Container, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";

function App() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isModelResponding, setIsModelResponding] = useState(false);
    const chatContainerRef = useRef(null);

    const handleSubmit = async () => {
        if (input.trim()) {
            setChatHistory([...chatHistory, { user: input, assistant: null }]);
            setInput("");
            setIsModelResponding(true);

            const response = await fetch(
                process.env.NODE_ENV === "production"
                    ? "https://allchat.online/api/interact"
                    : "http://localhost:5000/interact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ input }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const newChatHistory = [
                    ...chatHistory,
                    { user: input, assistant: data.textResponse, image: data.imageResponse },
                ];
                setChatHistory(newChatHistory);
            } else {
                const newChatHistory = [
                    ...chatHistory.slice(0, -1),
                    { user: input, assistant: "Error: Failed to get response from the server." },
                ];
                setChatHistory(newChatHistory);
            }

            setIsModelResponding(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <Container maxWidth="md" style={{ display: "flex", flexDirection: "column", height: "95vh" }}>
            <Box flex={1} overflow="auto" padding={2} display="flex" flexDirection="column" ref={chatContainerRef}>
                {chatHistory.map((chat, index) => (
                    <Box key={index} display="flex" flexDirection="column" marginBottom={2}>
                        <Box alignSelf="flex-end" bgcolor="#d4edda" color="#155724" padding={1} borderRadius={2}>
                            {chat.user}
                        </Box>
                        <Box
                            alignSelf="flex-start"
                            bgcolor="#cff4fc"
                            color="#0c5460"
                            padding={1}
                            borderRadius={2}
                            marginTop={1}
                        >
                            {isModelResponding && chat.assistant === null && <CircularProgress size={20} />}
                            {chat.assistant !== null && <ReactMarkdown>{chat.assistant}</ReactMarkdown>}
                            {chat.image && (
                                <img
                                    src={`data:image/png;base64,${chat.image.toString("base64")}`}
                                    alt="Model output"
                                    style={{ maxWidth: "100%" }}
                                />
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box display="flex" padding={2}>
                <TextField
                    fullWidth
                    label="Enter your question"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginLeft: 8 }}>
                    Submit
                </Button>
            </Box>
        </Container>
    );
}

export default App;
