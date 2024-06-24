import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import { ArtifactViewer } from "./ArtifactViewer";
import { API_URL } from "./Main";

const Artifact = () => {
    const [artifact, setArtifact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchArtifact = async () => {
            try {
                if (id) {
                    const response = await fetch(API_URL + `/artifacts/${id}`);
                    if (!response.ok) {
                        throw new Error("Failed to load artifact");
                    }
                    const data = await response.json();
                    setArtifact(data);
                } else {
                    const storedArtifact = localStorage.getItem("currentArtifact");
                    if (storedArtifact) {
                        setArtifact(JSON.parse(storedArtifact));
                    } else {
                        throw new Error("No artifact found in local storage");
                    }
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArtifact();
    }, [id]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

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
