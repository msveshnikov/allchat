import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Container, CircularProgress, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FileUploader from "./FileUploader";

const API_URL =
    process.env.NODE_ENV === "production" ? "https://allchat.online/api/interact" : "http://localhost:5000/interact";

function App() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [storedChatHistories, setStoredChatHistories] = useState([]);
    const [isModelResponding, setIsModelResponding] = useState(false);
    const chatContainerRef = useRef(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const storedHistory = localStorage.getItem("chatHistory");
        const storedChatHistories = localStorage.getItem("storedChatHistories");

        if (storedHistory) {
            setChatHistory(JSON.parse(storedHistory));
        }

        if (storedChatHistories) {
            setStoredChatHistories(JSON.parse(storedChatHistories));
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        if (chatHistory.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        }
        if (storedChatHistories.length > 0) {
            localStorage.setItem("storedChatHistories", JSON.stringify(storedChatHistories));
        }
    }, [chatHistory, storedChatHistories]);

    const handleSubmit = async () => {
        if (input.trim()) {
            setChatHistory([...chatHistory, { user: input, assistant: null }]);
            setInput("");
            setIsModelResponding(true);

            const response = await fetch(API_URL, {
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

    const generateChatSummary = async (chatHistory) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: "!!! Extract main topic from this chat in one simple short statement and return it without anything else: ",
                chatHistory: chatHistory.map((h) => ({ user: h.user, assistant: h.assistant })),
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data?.textResponse?.slice(0, 50) + "...";
        } else {
            const messages = chatHistory.map((chat) => chat.user + (chat.assistant || ""));
            const summary = messages.join(" ").slice(0, 50) + "...";
            return summary;
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const clearAllChatHistory = () => {
        setChatHistory([]);
        setStoredChatHistories([]);
        localStorage.removeItem("chatHistory");
        localStorage.removeItem("storedChatHistories");
        setDrawerOpen(false);
    };

    const handleNewChat = async () => {
        if (chatHistory.length > 0) {
            const summary = await generateChatSummary(chatHistory);
            setStoredChatHistories([{ chatHistory, summary }, ...storedChatHistories.slice(0, 9)]);
        }
        setChatHistory([]);
        localStorage.removeItem("chatHistory");
        setDrawerOpen(false);
    };

    const handleHistorySelection = async (index) => {
        const updatedStoredChatHistories = [...storedChatHistories];
        if (updatedStoredChatHistories.length === 10) {
            updatedStoredChatHistories.shift();
        }
        const summary = await generateChatSummary(chatHistory);
        updatedStoredChatHistories[index] = { chatHistory, summary };
        setStoredChatHistories(updatedStoredChatHistories);
        setChatHistory(storedChatHistories[index].chatHistory);
        setDrawerOpen(false);
    };

    const handleFileUpload = async (fileData) => {
        const fileBytesBase64 = fileData.split(",")[1];
        const fileType = fileData.split(";")[0].split("/")[1];

        setChatHistory([...chatHistory, { user: `${fileType.toUpperCase()} Document`, assistant: null }]);
        setIsModelResponding(true);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileType,
                fileBytesBase64,
                chatHistory: chatHistory.map((h) => ({ user: h.user, assistant: h.assistant })),
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const newChatHistory = [
                ...chatHistory,
                { user: `${fileType.toUpperCase()} Document`, assistant: data.textResponse, image: data.imageResponse },
            ];
            setChatHistory(newChatHistory);
        }
        setIsModelResponding(false);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2 }} variant="h6" noWrap>
                        AllChat
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer PaperProps={{ sx: { width: 200 } }} open={drawerOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <List style={{ flexGrow: 1, overflowY: "auto" }}>
                        <ListItem button onClick={handleNewChat}>
                            <ListItemText primary="New Chat" />
                        </ListItem>
                        {storedChatHistories.map((history, index) => (
                            <ListItem button key={index} onClick={() => handleHistorySelection(index)}>
                                <ListItemText primary={history.summary} />
                            </ListItem>
                        ))}
                    </List>
                    <ListItem
                        button
                        onClick={clearAllChatHistory}
                        style={{ color: "white", backgroundColor: "#F50057" }}
                    >
                        <ListItemText primary="Clear All" />
                    </ListItem>
                </div>
            </Drawer>
            <Container maxWidth="md" style={{ display: "flex", flexDirection: "column", height: "93vh" }}>
                <Box flex={1} overflow="auto" padding={2} display="flex" flexDirection="column" ref={chatContainerRef}>
                    {chatHistory.map((chat, index) => (
                        <Box
                            style={{ fontFamily: "PT Sans" }}
                            key={index}
                            display="flex"
                            flexDirection="column"
                            marginBottom={2}
                        >
                            <Box alignSelf="flex-end" bgcolor="#d4edda" color="#155724" padding={1} borderRadius={2}>
                                {chat.user}
                            </Box>
                            <Box
                                alignSelf="flex-start"
                                bgcolor="#cff4fc"
                                color="#0c5460"
                                padding={1}
                                marginTop={1}
                                borderRadius={2}
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
                    <FileUploader onFileUpload={handleFileUpload} />
                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginLeft: 8 }}>
                        Send
                    </Button>
                </Box>
            </Container>
        </>
    );
}

export default App;
