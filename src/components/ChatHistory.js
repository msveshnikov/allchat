import React, { memo } from "react";
import { Box, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/monokai";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("python", python);

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

const linkStyle = {
    maxWidth: "100%", // Set the maximum width to 100% for links
    overflowWrap: "break-word", // Allow long links to wrap to the next line
    wordBreak: "break-all", // Break words if they are too long to fit on a single line
};

const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            style={{
                maxWidth: "100%",
                overflowX: "auto",
                padding: "8px",
                position: "relative",
            }}
        >
            <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
                <IconButton
                    aria-label="Copy code"
                    onClick={handleCopy}
                    style={{
                        position: "absolute",
                        top: -5,
                        right: 8,
                        zIndex: 1,
                    }}
                    size="small"
                >
                    <FileCopyOutlinedIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <SyntaxHighlighter
                language={language}
                style={style}
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
                                            />
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                                    a: ({ node, ...props }) => <a style={linkStyle} {...props} />, // Apply linkStyle to anchor tags
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
