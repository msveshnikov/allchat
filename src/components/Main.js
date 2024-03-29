import React, { useState, useEffect } from "react";
import {
    Container,
    Snackbar,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AppHeader from "./AppHeader";
import SideDrawer from "./SideDrawer";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import AuthForm from "./AuthForm";
import MyAccountPage from "./MyAccountPage";
import { animateScroll as scroll } from "react-scroll";

const MAX_CHAT_HISTORY_LENGTH = 30;
const MAX_CHATS = 7;

export const API_URL = process.env.NODE_ENV === "production" ? "https://allchat.online/api" : "http://localhost:5000";

function Main() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [storedChatHistories, setStoredChatHistories] = useState([]);
    const [isModelResponding, setIsModelResponding] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [model, setModel] = useState(localStorage.getItem("selectedModel") || "gemini");
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [openMyAccountModal, setOpenMyAccountModal] = useState(false);
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleAuthentication = (token, email) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        setUserEmail(email);
        setIsAuthenticated(true);
        setOpenAuthModal(false);
    };

    const handleOpenAuthModal = () => {
        setOpenAuthModal(true);
    };

    const handleCloseAuthModal = () => {
        setOpenAuthModal(false);
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
            scroll.scrollToBottom({
                containerId: "chatid",
                duration: 500,
                smooth: true,
            });
            if (chatHistory.length > 0) {
                const chatHistoryToStore = chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH);
                localStorage.setItem("chatHistory", JSON.stringify(chatHistoryToStore));
            }
        } catch {}
    }, [chatHistory]);

    useEffect(() => {
        try {
            if (storedChatHistories.length > 0) {
                localStorage.setItem("storedChatHistories", JSON.stringify(storedChatHistories));
            }
            localStorage.setItem("selectedModel", model);
        } catch {}
    }, [model, storedChatHistories]);

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

    const sendFileAndQuery = async (fileType, fileBytesBase64, input) => {
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

            const response = await fetch(API_URL + "/interact", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    input,
                    fileType,
                    fileBytesBase64,
                    model,
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
            } else if (response.status === 403) {
                // Handle 403 Forbidden error (force sign-out)
                setIsAuthenticated(false);
                setSnackbarMessage("Authentication failed. Please sign in.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
                setUserEmail("");
                setIsAuthenticated(false);
                const newChatHistory = [
                    ...chatHistory,
                    { user: input, assistant: null, error: "Authentication failed." },
                ];
                setChatHistory(newChatHistory);
                setOpenAuthModal(true);
            } else {
                const data = await response.json();
                const newChatHistory = [...chatHistory, { user: input, assistant: null, error: data.error }];
                setChatHistory(newChatHistory);
            }
        } catch (error) {
            const newChatHistory = [
                ...chatHistory,
                { user: input, assistant: null, error: "Failed to connect to the server." },
            ];
            setChatHistory(newChatHistory);
        }

        setIsModelResponding(false);
        setSelectedFile(null);
    };

    function removeBrackets(text) {
        if (text?.startsWith("[") && text?.endsWith("]")) {
            return text.slice(1, -1);
        } else {
            return text;
        }
    }

    const generateChatSummary = async (chatHistory) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(API_URL + "/interact", {
            method: "POST",
            headers,
            body: JSON.stringify({
                model,
                input: "Extract main topic of this chat in one simple short statement (30 chars max) and return it without anything else in [] ",
                chatHistory: chatHistory.map((h) => ({ user: h.user, assistant: h.assistant })),
            }),
        });

        if (response?.ok) {
            const data = await response.json();
            return removeBrackets(data?.textResponse)?.slice(0, 50) + "...";
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
                setStoredChatHistories([{ chatHistory, summary }, ...storedChatHistories.slice(0, MAX_CHATS - 1)]);
            });
        }
        setChatHistory([]);
        localStorage.removeItem("chatHistory");
        setDrawerOpen(false);
        setSelectedFile(null);
    };

    const handleHistorySelection = (index) => {
        const updatedStoredChatHistories = [...storedChatHistories];
        if (updatedStoredChatHistories.length >= MAX_CHATS) {
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

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setUserEmail("");
        setIsAuthenticated(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleMyAccount = () => {
        setOpenMyAccountModal(true);
        fetchUserData();
    };

    const handleCloseMyAccountModal = () => {
        setOpenMyAccountModal(false);
    };

    const handleRun = async (language, program) => {
        if (language === "python") {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            setChatHistory([...chatHistory, { user: "🏃", assistant: null }]);
            setIsModelResponding(true);

            const response = await fetch(API_URL + "/run", {
                method: "POST",
                headers,
                body: JSON.stringify({ program }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatHistory([
                    ...chatHistory,
                    {
                        user: "🏃",
                        assistant: `Output:\n${data.output}`,
                    },
                ]);
            } else {
                const errorMessage = await response.text();
                setChatHistory([
                    ...chatHistory,
                    {
                        user: "🏃",
                        assistant: `Error: ${errorMessage}`,
                    },
                ]);
            }
        }
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${API_URL}/user`, {
            method: "GET",
            headers,
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        }
    };

    return (
        <>
            <AppHeader
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                onSignOut={handleSignOut}
                onMyAccount={handleMyAccount}
                onOpenAuthModal={handleOpenAuthModal}
                onToggle={toggleDrawer}
            />
            <SideDrawer
                isOpen={drawerOpen}
                onToggle={toggleDrawer}
                onNewChat={handleNewChat}
                storedChatHistories={storedChatHistories}
                onHistorySelection={handleHistorySelection}
                model={model}
                onModelChange={setModel}
                onClearAll={clearAllChatHistory}
            />
            <Dialog open={openAuthModal} onClose={handleCloseAuthModal}>
                <DialogContent>
                    <AuthForm onAuthentication={handleAuthentication} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAuthModal}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openMyAccountModal} onClose={handleCloseMyAccountModal} maxWidth="md" fullWidth>
                <DialogContent>{user && <MyAccountPage user={user} />}</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMyAccountModal}>Close</Button>
                </DialogActions>
            </Dialog>
            <Container
                maxWidth="md"
                sx={isMobile ? { m: 0, p: 0 } : {}}
                style={{ display: "flex", flexDirection: "column", height: "91vh" }}
            >
                <ChatHistory onRun={handleRun} chatHistory={chatHistory} isModelResponding={isModelResponding} />
                <ChatInput
                    input={input}
                    setInput={setInput}
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    onSubmit={handleSubmit}
                />
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </>
    );
}

export default Main;
