import React, { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { OpenScad } from "./OpenScad";
import { MermaidChart } from "./MermaidChart";

export const detectLanguage = (code) => {
    if (code.includes("def ") || code.includes("import ")) return "python";
    if (code.includes("function ") || code.includes("const ")) return "js";
    if (code.includes("public class ") || code.includes("System.out.println")) return "java";
    return "python";
};

export const ArtifactViewer = ({ type, content, name }) => {
    const [htmlView, setHtmlView] = useState("preview");

    const handleHtmlViewChange = (event, value) => {
        if (value !== null) {
            setHtmlView(value);
        }
    };

    switch (type) {
        case "html":
            return (
                <Box width="100%">
                    <ToggleButtonGroup
                        value={htmlView}
                        exclusive
                        onChange={handleHtmlViewChange}
                        aria-label="HTML view"
                        size="small"
                        sx={{ mb: 2, mt: -3 }}
                    >
                        <ToggleButton value="preview" aria-label="preview">
                            Preview
                        </ToggleButton>
                        <ToggleButton value="code" aria-label="code">
                            Code
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {htmlView === "preview" ? (
                        <Box width="100%" height="600px">
                            <iframe
                                srcDoc={content}
                                style={{ width: "100%", height: "100%", border: "none" }}
                                title="HTML Artifact"
                            />
                        </Box>
                    ) : (
                        <Box width="100%" overflow="auto">
                            <CodeBlock language="html" value={content} />
                        </Box>
                    )}
                </Box>
            );
        case "mermaid":
            const mermaidContent =
                content.startsWith("```mermaid") && content.endsWith("```") ? content.slice(10, -3).trim() : content;
            return (
                <Box width="100%">
                    <MermaidChart chart={mermaidContent} />
                </Box>
            );
        case "code":
            return (
                <Box width="100%" overflow="auto">
                    <CodeBlock language={detectLanguage(content)} value={content} />
                </Box>
            );
        case "openscad":
            return <OpenScad content={content} name={name} />;
        case "text":
        case "other":
        default:
            return (
                <Box width="100%" overflow="auto">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
            );
    }
};
