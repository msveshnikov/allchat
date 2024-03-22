import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Container, CircularProgress, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FileSelector from "./FileSelector";
import ModelSwitch from "./ModelSwitch";
import AuthForm from "./AuthForm";

const MAX_CHAT_HISTORY_LENGTH = 30;
const API_URL =
    process.env.NODE_ENV === "production" ? "https://allchat.online/api/interact" : "http://localhost:5000/interact";

function App() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [storedChatHistories, setStoredChatHistories] = useState([]);
    const [isModelResponding, setIsModelResponding] = useState(false);
    const chatContainerRef = useRef(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [model, setModel] = useState(localStorage.getItem("selectedModel") || "gemini");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuthentication = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

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
        try {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
            if (chatHistory.length > 0) {
                const chatHistoryToStore = chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH);
                localStorage.setItem("chatHistory", JSON.stringify(chatHistoryToStore));
            }
            if (storedChatHistories.length > 0) {
                localStorage.setItem("storedChatHistories", JSON.stringify(storedChatHistories));
            }
            localStorage.setItem("selectedModel", model);
        } catch {}
    }, [chatHistory, model, storedChatHistories]);

    const getFileTypeIcon = (mimeType) => {
        switch (mimeType) {
            case "pdf":
                return "📃";
            case "msword":
            case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                return "📝";
            case "vnd.ms-excel":
            case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return "📊";
            case "png":
            case "jpeg":
            case "jpg":
                return null;
            default:
                return "📁";
        }
    };

    const handleSubmit = async () => {
        if (input.trim() || selectedFile) {
            let fileType = "";

            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    const fileData = reader.result;
                    fileType = fileData.split(";")[0].split("/")[1];
                    const fileBytesBase64 = fileData.split(",")[1];
                    sendFileAndQuery(fileType, fileBytesBase64, input);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                sendFileAndQuery("", "", input);
            }
        }
    };

    const sendFileAndQuery = async (fileType, fileBytesBase64, input, selectedModel) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            setChatHistory([
                ...chatHistory,
                { user: input, assistant: null, fileType, userImageData: fileBytesBase64 },
            ]);
            setInput("");
            setIsModelResponding(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    input,
                    fileType,
                    fileBytesBase64,
                    selectedModel,
                    chatHistory: chatHistory.map((h) => ({ user: h.user, assistant: h.assistant })),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newChatHistory = [
                    ...chatHistory,
                    {
                        user: input,
                        assistant: data.textResponse,
                        image: data.imageResponse,
                        fileType,
                        userImageData: fileBytesBase64,
                    },
                ];
                setChatHistory(newChatHistory);
            } else {
                const newChatHistory = [
                    ...chatHistory.slice(0, -1),
                    { user: input, assistant: null, error: "Failed response from the server." },
                ];
                setChatHistory(newChatHistory);
            }
        } catch (error) {
            const newChatHistory = [
                ...chatHistory.slice(0, -1),
                { user: input, assistant: null, error: "Failed to connect to the server." },
            ];
            setChatHistory(newChatHistory);
        }

        setIsModelResponding(false);
        setSelectedFile(null);
    };

    const generateChatSummary = async (chatHistory) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: "!!! Extract main topic of this chat in one simple short statement and return it without anything else: ",
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
        setSelectedFile(null);
    };

    const handleNewChat = () => {
        if (chatHistory.length > 0) {
            Promise.resolve().then(async () => {
                const summary = await generateChatSummary(chatHistory);
                setStoredChatHistories([{ chatHistory, summary }, ...storedChatHistories.slice(0, 7)]);
            });
        }
        setChatHistory([]);
        localStorage.removeItem("chatHistory");
        setDrawerOpen(false);
        setSelectedFile(null);
    };

    const handleHistorySelection = (index) => {
        const updatedStoredChatHistories = [...storedChatHistories];
        if (updatedStoredChatHistories.length >= 8) {
            updatedStoredChatHistories.shift();
        }
        Promise.resolve().then(async () => {
            const summary = await generateChatSummary(chatHistory);
            updatedStoredChatHistories[index] = { chatHistory, summary };
            setStoredChatHistories(updatedStoredChatHistories);
        });
        setChatHistory(storedChatHistories[index].chatHistory);
        setDrawerOpen(false);
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
                    {isAuthenticated ? (
                        <IconButton>
                            <AccountCircleIcon />
                        </IconButton>
                    ) : (
                        <AuthForm onAuthentication={handleAuthentication} />
                    )}
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
                    <div style={{ marginBottom: "auto" }}>
                        <ListItem>
                            <ModelSwitch model={model} onModelChange={setModel} />
                        </ListItem>
                    </div>
                    <ListItem
                        button
                        onClick={clearAllChatHistory}
                        style={{ color: "white", backgroundColor: "#F50057" }}
                    >
                        <ListItemText primary="Clear All" />
                    </ListItem>
                </div>
            </Drawer>
            <Container maxWidth="md" style={{ display: "flex", flexDirection: "column", height: "92vh" }}>
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
                                {chat.fileType && getFileTypeIcon(chat.fileType) !== null && (
                                    <span style={{ fontSize: "3rem" }}>{getFileTypeIcon(chat.fileType)}</span>
                                )}
                                {!getFileTypeIcon(chat.fileType) && chat.userImageData && (
                                    <img
                                        src={`data:image/${chat.fileType.split("/")[1]};base64,${chat.userImageData}`}
                                        alt="User input"
                                        style={{ maxWidth: "100%" }}
                                    />
                                )}
                            </Box>
                            <Box
                                alignSelf="flex-start"
                                bgcolor={chat.error ? "#f8d7da" : "#cff4fc"}
                                color={chat.error ? "#721c24" : "#0c5460"}
                                padding={1}
                                marginTop={1}
                                borderRadius={2}
                            >
                                {isModelResponding &&
                                    chat.assistant === null &&
                                    chatHistory[chatHistory.length - 1] === chat && <CircularProgress size={20} />}
                                {chat.assistant !== null && <ReactMarkdown>{chat.assistant}</ReactMarkdown>}
                                {chat.error && chat.error}
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
                    <FileSelector onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginLeft: 8 }}>
                        Send
                    </Button>
                </Box>
            </Container>
        </>
    );
}

export default App;
