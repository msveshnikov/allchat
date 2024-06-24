import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { OpenScad } from "./OpenScad";
import { MermaidChart } from "./MermaidChart";

const ArtifactViewer = ({ type, content, modelName }) => {
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
            return <OpenScad content={content} modelName={modelName} />;
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

const detectLanguage = (code) => {
    if (code.includes("def ") || code.includes("import ")) return "python";
    if (code.includes("function ") || code.includes("const ")) return "js";
    if (code.includes("public class ") || code.includes("System.out.println")) return "java";
    return "python";
};

const Artifact = () => {
    const [artifact, setArtifact] = useState(null);

    useEffect(() => {
        const storedArtifact = localStorage.getItem("currentArtifact");
        if (storedArtifact) {
            setArtifact(JSON.parse(storedArtifact));
        }
    }, []);

    if (!artifact) {
        return <Typography>No artifact found.</Typography>;
    }

    return (
        <Box p={3}>
            <Paper elevation={3}>
                <Box p={2}>
                    <Typography variant="h4" gutterBottom>
                        {artifact.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Type: {artifact.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Last Updated: {new Date(artifact.updatedAt).toLocaleString()}
                    </Typography>
                </Box>
                <Box p={2}>
                    <ArtifactViewer type={artifact.type} content={artifact.content} modelName={artifact.name} />
                </Box>
            </Paper>
        </Box>
    );
};

export default Artifact;
