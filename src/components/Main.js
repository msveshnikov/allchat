import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Container,
    Snackbar,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
    DialogTitle,
    TextField,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import AppHeader from "./AppHeader";
import SideDrawer from "./SideDrawer";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import AuthForm from "./AuthForm";
import Settings, { models } from "./Settings";
import { animateScroll as scroll } from "react-scroll";
import readmeContent from "../README.md";
import { ConfirmModal } from "./ConfirmModal";
import { useNavigate, useParams } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RedditIcon from "@mui/icons-material/Reddit";
import { useReward } from "react-rewards";

const achievementSounds = ["/ach1.mp3", "/ach2.mp3", "/ach3.mp3", "/ach4.mp3"];

const MAX_CHAT_HISTORY_LENGTH = 30;
const MAX_CHATS = 5;

export const API_URL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_URL : "http://localhost:5000";
export const WS_URL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_WS_URL : "ws://localhost:5000";

function Main({ themeMode, toggleTheme }) {
    const [input, setInput] = useState("");
    const [pastedImage, setPastedImage] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [storedChatHistories, setStoredChatHistories] = useState([]);
    const [isModelResponding, setIsModelResponding] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sound, setSound] = useState(localStorage.getItem("sound") === "true");
    const [tools, setTools] = useState((localStorage.getItem("tools") ?? "true") === "true");
    const [temperature, setTemperature] = useState(Number(localStorage.getItem("temperature") || "0.7"));
    const [selectedModel, setSelectedModel] = useState(
        localStorage.getItem("selectedModel") || "gemini-1.5-pro-preview-0514"
    );
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);
    const [referrer, setReferrer] = useState("");
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const { reward } = useReward("rewardId", "emoji");
    const { chatId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const isFirstTime = !localStorage.getItem("isVisited");
        if (isFirstTime) {
            setTimeout(() => {
                setSnackbarMessage("Click top bar to select your preferred model 🤗");
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }, 1000);
            localStorage.setItem("isVisited", "true");
        }
    }, []);

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

        if (!chatId) {
            if (storedHistory) {
                setChatHistory(JSON.parse(storedHistory));
            } else if (!storedChatHistories) {
                fetch(readmeContent)
                    .then((res) => res.text())
                    .then((text) => {
                        setChatHistory([{ user: "Who are you?", assistant: text }]);
                    });
            }
        }

        if (storedChatHistories) {
            setStoredChatHistories(JSON.parse(storedChatHistories));
        }
    }, [chatId]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            const response = await fetch(API_URL + `/chat/${chatId}`);
            if (response.ok) {
                const data = await response.json();
                setChatHistory(data.chatHistory);
                setSelectedModel(data.model);
                localStorage.setItem("selectedCustomGPT", data.customGPT);
            }
        };

        if (chatId) {
            localStorage.setItem("chatId", chatId);
            fetchChatHistory();
            const socket = new WebSocket(`${WS_URL}/subscribe`);
            socket.addEventListener("message", (event) => {
                const data = JSON.parse(event.data);
                if (data?.chatId === chatId && data?.message?.userId !== user?._id) {
                    setChatHistory((prevChatHistory) => [...prevChatHistory, data?.message]);
                }
            });
            return () => {
                socket.close();
            };
        }
    }, [chatId, user?._id]);

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
    }, [chatHistory, chatId]);

    useEffect(() => {
        try {
            if (storedChatHistories.length > 0) {
                localStorage.setItem("storedChatHistories", JSON.stringify(storedChatHistories));
            }
            localStorage.setItem("sound", sound);
            localStorage.setItem("tools", tools);
            localStorage.setItem("temperature", temperature);
            localStorage.setItem("selectedModel", selectedModel);
        } catch {}
    }, [storedChatHistories, sound, temperature, tools, selectedModel]);

    useEffect(() => {
        fetchUserData();
        setReferrer(window.document.referrer);
        const chatId = localStorage.getItem("chatId");
        if (chatId) {
            navigate("/chat/" + chatId);
        }
    }, [navigate]);

    const removeFormatting = (text) => {
        return text.replace(/\*\*|__|\[|\]|\(|\)|`/g, "");
    };

    const handleSubmit = async () => {
        if (input.trim() || pastedImage || selectedFile) {
            let fileType = "";

            if (pastedImage || selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    const fileData = reader.result;
                    fileType = fileData.split(";")[0].split("/")[1];
                    const fileBytesBase64 = fileData.split(",")[1];
                    setPastedImage(null);
                    sendFileAndQuery(fileType, fileBytesBase64, input);
                };
                reader.readAsDataURL(pastedImage || selectedFile);
            } else {
                sendFileAndQuery("", "", input);
            }
        }
    };

    const sendFileAndQuery = async (fileType, fileBytesBase64, input, newHistory) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            setChatHistory([
                ...(newHistory || chatHistory),
                { user: input, assistant: null, fileType, userImageData: fileBytesBase64 },
            ]);
            setInput("");
            setIsModelResponding(true);

            const response = await fetch(API_URL + "/interact", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    input,
                    lang: (navigator.languages && navigator.languages[0]) || navigator.language,
                    fileType,
                    fileBytesBase64,
                    model: selectedModel,
                    referrer,
                    customGPT: localStorage.getItem("selectedCustomGPT"),
                    tools: models[selectedModel].includes("tools") && tools,
                    temperature,
                    chatHistory: (newHistory || chatHistory).map((h) => ({ user: h.user, assistant: h.assistant })),
                    chatId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newChatHistory = [
                    ...(newHistory || chatHistory),
                    {
                        user: input,
                        userId: user._id,
                        assistant: data.textResponse,
                        toolsUsed: data.toolsUsed,
                        image: data.imageResponse,
                        fileType,
                        gpt: data.gpt,
                        userImageData: fileBytesBase64,
                        artifact: data.artifact,
                    },
                ];
                setChatHistory(newChatHistory);
                if (data.toolsUsed.includes("award_achievement")) {
                    const randomSoundIndex = Math.floor(Math.random() * achievementSounds.length);
                    const audio = new Audio(achievementSounds[randomSoundIndex]);
                    audio.play();
                    reward();
                    setSnackbarMessage("Achievement unlocked! Check your Account!");
                    setSnackbarOpen(true);
                }
                if (sound) {
                    const utterance = new SpeechSynthesisUtterance(removeFormatting(data.textResponse));
                    window.speechSynthesis.speak(utterance);
                }
            } else if (response.status === 403) {
                setIsAuthenticated(false);
                setSnackbarMessage("Authentication failed. Please Login.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
                setUserEmail("");
                setIsAuthenticated(false);
                const newChatHistory = [
                    ...(newHistory || chatHistory),
                    { user: input, assistant: null, error: "Authentication failed." },
                ];
                setChatHistory(newChatHistory);
                setOpenAuthModal(true);
            } else if (response.status === 402) {
                setSnackbarMessage("Please activate subscription");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                const data = await response.json();
                const newChatHistory = [
                    ...(newHistory || chatHistory),
                    { user: input, assistant: null, error: data.error },
                ];
                setChatHistory(newChatHistory);
                setOpenSettingsModal(true);
            } else {
                const data = await response.json();
                const newChatHistory = [
                    ...(newHistory || chatHistory),
                    { user: input, assistant: null, error: data.error },
                ];
                setChatHistory(newChatHistory);
            }
        } catch (error) {
            const newChatHistory = [
                ...(newHistory || chatHistory),
                { user: input, assistant: null, error: "Failed to connect to the server." },
            ];
            setChatHistory(newChatHistory);
        }

        setIsModelResponding(false);
        setSelectedFile(null);
        setPastedImage(null);
    };

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
                model: "gemini-1.5-flash-preview-0514",
                temperature: 0.1,
                referrer,
                input: "Extract main topic of this chat in one simple short statement without formatting (30 chars max) and return it without anything else in [] ",
                chatHistory: chatHistory.map((h) => ({ user: h.user, assistant: h.assistant })),
            }),
        });

        if (response?.ok) {
            const data = await response.json();
            return data?.textResponse?.trim();
        } else {
            const messages = chatHistory.map((chat) => chat.user + (chat.assistant || ""));
            const summary = messages.join(" ").slice(0, 30);
            return summary;
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const clearAllChatHistory = async () => {
        setShowClearConfirmation(true);
    };

    const confirmClearChats = () => {
        setChatHistory([]);
        setStoredChatHistories([]);
        localStorage.removeItem("chatHistory");
        localStorage.removeItem("storedChatHistories");
        setDrawerOpen(false);
        setSelectedFile(null);
        setShowClearConfirmation(false);
        localStorage.removeItem("chatId");
        navigate("/");
    };

    const handleNewChat = () => {
        if (chatHistory.length > 0) {
            Promise.resolve().then(async () => {
                const summary = await generateChatSummary(chatHistory);
                setStoredChatHistories([
                    { chatHistory, summary, chatId },
                    ...storedChatHistories.slice(0, MAX_CHATS - 1),
                ]);
            });
        }
        setChatHistory([]);
        localStorage.removeItem("chatHistory");
        localStorage.removeItem("chatId");
        setDrawerOpen(false);
        setSelectedFile(null);
        navigate("/");
    };

    const handleHistorySelection = (index) => {
        if (chatHistory.length > 0) {
            Promise.resolve().then(async () => {
                const updatedStoredChatHistories = [...storedChatHistories];
                const summary = await generateChatSummary(chatHistory);
                updatedStoredChatHistories[index] = { chatHistory, summary, chatId };
                setStoredChatHistories(updatedStoredChatHistories);
            });
        } else {
            const updatedStoredChatHistories = storedChatHistories.filter((_, i) => i !== index);
            setStoredChatHistories(updatedStoredChatHistories);
        }
        setChatHistory(storedChatHistories[index].chatHistory);
        if (storedChatHistories[index].chatId) {
            navigate("/chat/" + storedChatHistories[index].chatId);
        } else {
            localStorage.removeItem("chatId");
            navigate("/");
        }
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

    const handleSettings = async () => {
        await fetchUserData();
        setOpenSettingsModal(true);
    };

    const handleCloseSettingsModal = () => {
        setOpenSettingsModal(false);
    };

    const handleRun = async (language, program) => {
        if (language !== "python") {
            return;
        }
        try {
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

            const data = await response.json();
            if (response.ok) {
                setChatHistory([
                    ...chatHistory,
                    {
                        user: "🏃",
                        assistant: data.output,
                        image: data.imageResponse,
                    },
                ]);
            } else {
                setChatHistory([
                    ...chatHistory,
                    {
                        user: "🏃",
                        assistant: null,
                        error: data.error,
                    },
                ]);
            }
        } catch (error) {
            const newChatHistory = [
                ...chatHistory,
                { user: "🏃", assistant: null, error: "Failed to connect to the server or server timeout" },
            ];
            setChatHistory(newChatHistory);
        }
        setIsModelResponding(false);
    };

    const handleChange = async (newHistory, index) => {
        sendFileAndQuery(null, null, newHistory[index].user, newHistory.slice(0, index));
    };

    const handleDelete = async (newHistory) => {
        setChatHistory(newHistory);
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

    const handleCancelSubscription = async () => {
        setShowCancelConfirmation(true);
    };

    const confirmCancelSubscription = async () => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${API_URL}/cancel`, {
            method: "POST",
            headers,
            body: JSON.stringify({ subscriptionId: user.subscriptionId }),
        });

        if (response.ok) {
            setSnackbarMessage("Subscription canceled successfully");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            fetchUserData();
        } else {
            const error = await response.json();
            setSnackbarMessage(`Error canceling subscription: ${error.error}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }

        setShowCancelConfirmation(false);
    };

    const handleInviteUser = () => {
        setInviteDialogOpen(true);
    };

    const handleInviteClose = () => {
        setInviteDialogOpen(false);
        setInviteEmail("");
    };

    const handleInviteSubmit = async () => {
        if (!inviteEmail) {
            handleInviteClose();
            return;
        }
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(API_URL + "/invite", {
            method: "POST",
            headers,
            body: JSON.stringify({
                email: inviteEmail,
                model: selectedModel,
                customGPT: localStorage.getItem("selectedCustomGPT"),
                chatHistory,
                chatId,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            handleInviteClose();
            setSnackbarMessage("Invitation sent successfully!");
            setSnackbarOpen(true);
            navigate("/chat/" + data.chatId);
        } else {
            setSnackbarMessage("Failed to send invitation.");
            setSnackbarOpen(true);
        }
    };

    const handleSocialShare = async (platform) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(API_URL + "/invite", {
            method: "POST",
            headers,
            body: JSON.stringify({
                model: selectedModel,
                customGPT: localStorage.getItem("selectedCustomGPT"),
                chatHistory,
                chatId,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const shareUrl = data.shareUrl;

            let shareLink;
            switch (platform) {
                case "facebook":
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                    break;
                case "twitter":
                    shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareUrl)}`;
                    break;
                case "linkedin":
                    shareLink = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}`;
                    break;
                case "reddit":
                    shareLink = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}`;
                    break;
                default:
                    break;
            }

            window.open(shareLink, "_blank");
            navigate("/chat/" + data.chatId);
        } else {
            setSnackbarMessage("Failed to get share URL.");
            setSnackbarOpen(true);
        }
    };

    const handleDeleteSharedChat = async () => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${API_URL}/sharedChats/${chatId}`, {
            method: "DELETE",
            headers,
        });

        if (response.ok) {
            setSnackbarMessage("Shared chat deleted successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            handleInviteClose();
            localStorage.removeItem("chatId");
            navigate("/");
        } else {
            const data = await response.json();
            setSnackbarMessage("Failed to delete shared chat. " + data.error);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <AppHeader
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                user={user}
                onSignOut={handleSignOut}
                onSettings={handleSettings}
                onOpenAuthModal={handleOpenAuthModal}
                onToggle={toggleDrawer}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
                themeMode={themeMode}
                toggleTheme={toggleTheme}
                onInviteUser={handleInviteUser}
                chatId={chatId}
            />
            <SideDrawer
                isOpen={drawerOpen}
                onToggle={toggleDrawer}
                onNewChat={handleNewChat}
                storedChatHistories={storedChatHistories}
                chatHistory={chatHistory}
                onHistorySelection={handleHistorySelection}
                sound={sound}
                tools={tools}
                toolsEnabled={models[selectedModel]?.includes("tools")}
                onSoundChange={setSound}
                onToolsChange={setTools}
                onClearAll={clearAllChatHistory}
                temperature={temperature}
                onTemperatureChange={setTemperature}
                admin={user?.admin}
            />
            <Dialog open={openAuthModal} onClose={handleCloseAuthModal}>
                <DialogContent>
                    <AuthForm onAuthentication={handleAuthentication} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAuthModal}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openSettingsModal} onClose={handleCloseSettingsModal} maxWidth="md" fullWidth>
                <DialogContent>
                    {user && (
                        <Settings
                            handleCloseSettingsModal={handleCloseSettingsModal}
                            handleCancelSubscription={handleCancelSubscription}
                            user={user}
                            selectedModel={selectedModel}
                            onModelSelect={setSelectedModel}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSettingsModal}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={inviteDialogOpen} onClose={handleInviteClose} maxWidth="sm" fullWidth>
                <DialogTitle>{`Invite User To This ${chatId ? "Shared" : ""} Chat`}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Box>
                        <Typography variant="h6" component="div" gutterBottom sx={{ mt: 5 }}>
                            Or share chat on:
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <IconButton onClick={() => handleSocialShare("facebook")}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton onClick={() => handleSocialShare("twitter")}>
                                <TwitterIcon />
                            </IconButton>
                            <IconButton onClick={() => handleSocialShare("linkedin")}>
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton onClick={() => handleSocialShare("reddit")}>
                                <RedditIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    {chatId && user?._id === chatHistory[0]?.userId && (
                        <Box mt={3}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteSharedChat}
                                startIcon={<DeleteIcon />}
                            >
                                Delete Shared Chat
                            </Button>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInviteClose}>Cancel</Button>
                    <Button onClick={handleInviteSubmit}>OK</Button>
                </DialogActions>
            </Dialog>
            <ConfirmModal
                title="Confirm Cancellation"
                text="Are you sure you want to cancel your subscription?"
                show={showCancelConfirmation}
                onConfirm={confirmCancelSubscription}
                setShow={setShowCancelConfirmation}
            />
            <ConfirmModal
                title="Confirm Clear All"
                text="Are you sure you want to clear all chat histories?"
                show={showClearConfirmation}
                onConfirm={confirmClearChats}
                setShow={setShowClearConfirmation}
            />
            <Container
                maxWidth="lg"
                sx={isMobile ? { m: 0, p: 0 } : {}}
                style={{ display: "flex", flexDirection: "column", height: "91vh", flexGrow: 1 }}
            >
                <ChatHistory
                    onChange={handleChange}
                    onDelete={handleDelete}
                    onRun={handleRun}
                    chatHistory={chatHistory}
                    isModelResponding={isModelResponding}
                    user={user}
                />
                <ChatInput
                    input={input}
                    setInput={setInput}
                    selectedFile={selectedFile}
                    selectedModel={selectedModel}
                    onFileSelect={handleFileSelect}
                    onSubmit={handleSubmit}
                    pastedImage={pastedImage}
                    setPastedImage={setPastedImage}
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
