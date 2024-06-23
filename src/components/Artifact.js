import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { OpenSCADViewer } from "./OpenSCADViewer";
import { MermaidChart } from "./MermaidChart";

const ArtifactViewer = ({ type, content }) => {
    const handleRunCode = (language, code) => {
        // Implement the code execution logic here
    };

    switch (type) {
        case "html":
            return (
                <Box width="100%" height="600px">
                    <iframe
                        srcDoc={content}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        title="HTML Artifact"
                    />
                </Box>
            );
        case "mermaid":
            return (
                <Box width="100%">
                    <MermaidChart chart={content} />
                </Box>
            );
        case "code":
            return (
                <Box width="100%" overflow="auto">
                    <CodeBlock language={detectLanguage(content)} value={content} onRun={handleRunCode} />
                </Box>
            );
        case "openscad":
            return <OpenSCADViewer content={content} />;
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
                        Created: {new Date(artifact.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Last Updated: {new Date(artifact.updatedAt).toLocaleString()}
                    </Typography>
                </Box>
                <Box p={2}>
                    <ArtifactViewer type={artifact.type} content={artifact.content} />
                </Box>
            </Paper>
        </Box>
    );
};

export default Artifact;
