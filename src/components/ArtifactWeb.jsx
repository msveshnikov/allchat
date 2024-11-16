import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { API_URL } from "./Main";

const ArtifactWeb = () => {
    const [artifact, setArtifact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchArtifact = async () => {
            try {
                const response = await fetch(API_URL + `/artifacts/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to load artifact");
                }
                const data = await response.json();
                setArtifact(data);
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

    if (!artifact || (artifact.type !== "html" && artifact.type !== "svg")) {
        return <Typography>No HTML artifact found.</Typography>;
    }

    return (
        <Box width="100%" height="100vh">
            <iframe
                srcDoc={artifact.content}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="HTML Artifact"
            />
        </Box>
    );
};

export default ArtifactWeb;
