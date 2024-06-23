import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { CodeBlock } from "./CodeBlock";
import STLViewer from "./STLViewer";
import { API_URL } from "./Main";

export const OpenSCADViewer = ({ content }) => {
    const [stlContent, setStlContent] = useState(null);
    const [error, setError] = useState(null);
    const [isConverted, setIsConverted] = useState(false);

    const handleConvert = async () => {
        try {
            const response = await fetch(API_URL + "/convert-to-stl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputScad: content }),
            });

            if (!response.ok) {
                throw new Error("Failed to convert OpenSCAD to STL");
            }

            const data = await response.json();
            setStlContent(data.stlContent);
            setIsConverted(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box>
            {!isConverted && (
                <Button onClick={handleConvert} variant="contained" color="primary">
                    Convert to STL
                </Button>
            )}
            {error && <Typography color="error">{error}</Typography>}
            {stlContent && <STLViewer fileContent={stlContent} />}
            <CodeBlock language="openscad" value={content} />
        </Box>
    );
};
