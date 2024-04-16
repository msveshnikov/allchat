import React, { memo, useState } from "react";
import { Box, CircularProgress, TextField, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import EditIcon from "@mui/icons-material/Edit";
import { CodeBlock } from "./CodeBlock";
import { Lightbox } from "react-modal-image";

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
        case "mp4":
            return "🎥";
        case "png":
        case "jpeg":
        case "jpg":
            return null;
        case "mp3":
        case "mpeg":
        case "x-m4a":
            return "🎵";
        default:
            return "📁";
    }
};

const linkStyle = {
    maxWidth: "100%",
    overflowWrap: "break-word",
    wordBreak: "break-all",
};

const ChatHistory = memo(({ chatHistory, isModelResponding, onRun, onChange }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
    const [lightboxMessageIndex, setLightboxMessageIndex] = useState(0);
    const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
    const [editingMessage, setEditingMessage] = useState("");

    const handleImageClick = (index, message) => {
        setLightboxImageIndex(index);
        setLightboxMessageIndex(message);
        setIsLightboxOpen(true);
    };

    const handleEditClick = (index, message) => {
        setEditingMessageIndex(index);
        setEditingMessage(message);
    };

    const handleMessageEdit = (index, newMessage) => {
        setEditingMessage(newMessage);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            setEditingMessageIndex(-1);
            if (chatHistory[editingMessageIndex].user !== editingMessage) {
                const updatedChatHistory = [...chatHistory];
                updatedChatHistory[editingMessageIndex].user = editingMessage;
                onChange(updatedChatHistory, editingMessageIndex);
            }
        }
    };

    return (
        <Box id="chatid" flex={1} overflow="auto" padding={2} display="flex" flexDirection="column">
            {chatHistory.map((chat, index) => (
                <Box
                    data-testid="chat-item"
                    key={index}
                    display="flex"
                    flexDirection="column"
                    marginBottom={2}
                    style={{
                        fontFamily: "PT Sans",
                    }}
                >
                    <Box
                        alignSelf="flex-end"
                        bgcolor={index !== editingMessageIndex ? "#d4edda" : "#f5f5a5"}
                        color="#155724"
                        padding={1}
                        borderRadius={2}
                        display="flex"
                        alignItems="center"
                    >
                        {index === editingMessageIndex ? (
                            <TextField
                                autoFocus
                                multiline
                                value={editingMessage}
                                onChange={(e) => handleMessageEdit(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onBlur={() => handleKeyDown({ keyCode: 13 })}
                                fullWidth
                            />
                        ) : (
                            <>
                                {chat.user}
                                <IconButton size="small" onClick={() => handleEditClick(index, chat.user)}>
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </>
                        )}
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
                            chatHistory[chatHistory.length - 1] === chat && (
                                <div style={{ display: "flex", alignItems: "center", minHeight: "40px" }}>
                                    <CircularProgress size={20} />
                                </div>
                            )}
                        {chat.assistant !== null && (
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const language = match ? match[1] : null;
                                        return !inline && language ? (
                                            <CodeBlock
                                                language={language}
                                                value={String(children).replace(/\n$/, "")}
                                                onRun={onRun}
                                            />
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                                    a: ({ node, ...props }) => <a style={linkStyle} {...props} />,
                                }}
                            >
                                {chat.assistant}
                            </ReactMarkdown>
                        )}

                        {chat.error && (
                            <Box
                                style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                }}
                            >
                                {chat.error}
                            </Box>
                        )}
                        {chat.image && (
                            <>
                                {Array.isArray(chat.image) ? (
                                    <Box display="flex" flexWrap="wrap" justifyContent="center" marginTop={2}>
                                        {chat.image.map((img, imgIndex) => (
                                            <Box key={imgIndex} margin={1} width={{ xs: "45%", sm: "20%" }}>
                                                <img
                                                    src={`data:image/png;base64,${img.toString("base64")}`}
                                                    alt="AI Generated"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleImageClick(imgIndex, index)}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <img
                                        src={`data:image/png;base64,${chat.image.toString("base64")}`}
                                        alt="Model output"
                                        style={{
                                            maxWidth: "100%",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleImageClick(0, index)}
                                    />
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            ))}

            {isLightboxOpen && (
                <Lightbox
                    large={
                        Array.isArray(chatHistory[lightboxMessageIndex].image)
                            ? `data:image/png;base64,${chatHistory[lightboxMessageIndex].image[
                                  lightboxImageIndex
                              ].toString("base64")}`
                            : `data:image/png;base64,${chatHistory[lightboxMessageIndex].image.toString("base64")}`
                    }
                    onClose={() => setIsLightboxOpen(false)}
                />
            )}
        </Box>
    );
});

export default ChatHistory;
