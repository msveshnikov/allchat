import React, { memo } from "react";
import { Box, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";

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

const CodeBlock = ({ language, value }) => {
    return (
        <div
            style={{
                maxWidth: "100%",
                overflowX: "auto",
                padding: "8px",
            }}
        >
            <SyntaxHighlighter
                language={language}
                wrapLines={true}
                lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

const ChatHistory = memo(({ chatHistory, isModelResponding, chatContainerRef }) => {
    return (
        <Box flex={1} overflow="auto" padding={2} display="flex" flexDirection="column" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
                <Box
                    data-testid="chat-item"
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
                                            />
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {chat.assistant}
                            </ReactMarkdown>
                        )}
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
    );
});

export default ChatHistory;
