import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/monokai";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Import the PlayArrow icon
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";

SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("python", python);

export const CodeBlock = ({ language, value, onRun }) => {
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
                        right: 32, // Adjust the right position to make space for the new button
                        zIndex: 1,
                    }}
                    size="small"
                >
                    <FileCopyOutlinedIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            {/* Add a new Tooltip and IconButton for the small green triangle button */}
            <Tooltip title="Run" placement="top">
                <IconButton
                    aria-label="Run code"
                    onClick={() => onRun(language, value)}
                    style={{
                        position: "absolute",
                        top: -5,
                        right: 8,
                        zIndex: 1,
                        color: "green",
                    }}
                    size="small"
                >
                    <PlayArrowIcon fontSize="small" />
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
