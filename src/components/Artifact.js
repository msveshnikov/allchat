import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import mermaid from "mermaid";

// Custom hook for Mermaid rendering
const useMermaid = () => {
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "default",
            securityLevel: "loose",
        });
    }, []);

    return {
        render: (id, definition) => {
            mermaid.render(id, definition).then(({ svg }) => {
                const output = document.getElementById(id);
                if (output) {
                    output.innerHTML = svg;
                }
            });
        },
    };
};

const MermaidChart = ({ chart }) => {
    const mermaidRef = useRef(null);
    const { render } = useMermaid();
    const [id] = useState(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        if (mermaidRef.current) {
            render(id, chart);
        }
    }, [chart, id, render]);

    return <div id={id} ref={mermaidRef} />;
};

const ArtifactViewer = ({ type, content }) => {
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
        case "text":
        case "other":
        default:
            return (
                <Box component="pre" width="100%" overflow="auto" p={2}>
                    <code>{content}</code>
                </Box>
            );
    }
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
