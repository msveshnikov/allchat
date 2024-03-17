import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Container, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const APP_URL =
    process.env.NODE_ENV === "production" ? "https://allchat.online/api/interact" : "http://localhost:5000/interact";

function App() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isModelResponding, setIsModelResponding] = useState(false);
    const chatContainerRef = useRef(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const storedHistory = localStorage.getItem("chatHistory");
        if (storedHistory) {
            setChatHistory(JSON.parse(storedHistory));
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        if (chatHistory.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    const handleSubmit = async () => {
        if (input.trim()) {
            setChatHistory([...chatHistory, { user: input, assistant: null }]);
            setInput("");
            setIsModelResponding(true);

            const response = await fetch(APP_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input,
                    chatHistory: chatHistory.map((h) => ({ user: h.user, assistant: h.assistant })),
                }),
            });

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

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const clearChatHistory = () => {
        setChatHistory([]);
        localStorage.removeItem("chatHistory");
        setDrawerOpen(false);
    };
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={toggleDrawer}>
                <List>
                    <ListItem button onClick={clearChatHistory}>
                        <ListItemText primary="Clear Chat" />
                    </ListItem>
                </List>
            </Drawer>
            <Container maxWidth="md" style={{ display: "flex", flexDirection: "column", height: "92vh" }}>
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
                        Send
                    </Button>
                </Box>
            </Container>
        </>
    );
}

export default App;
