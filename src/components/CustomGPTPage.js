import React, { useState } from "react";
import { Typography, TextField, Box, Button, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const CustomGPTPage = () => {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [files, setFiles] = useState([]);
    const [currentSize, setCurrentSize] = useState(0);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleInstructionsChange = (e) => {
        setInstructions(e.target.value);
    };

    const handleFilesDrop = (e) => {
        const droppedFiles = Array.from(e.dataTransfer.files);
        const updatedFiles = [...files, ...droppedFiles];
        const newSize = updatedFiles.reduce((acc, file) => acc + file.size, currentSize);
        setFiles(updatedFiles);
        setCurrentSize(newSize);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("instructions", instructions);
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("/api/customgpt", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setCurrentSize(data.currentSize);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 4,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Custom GPT
            </Typography>
            <TextField label="Name" value={name} onChange={handleNameChange} fullWidth margin="normal" />
            <TextField
                label="Instructions"
                value={instructions}
                onChange={handleInstructionsChange}
                multiline
                rows={12}
                fullWidth
                margin="normal"
            />
            <Box
                sx={{
                    border: "2px dashed gray",
                    borderRadius: 2,
                    padding: 2,
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}
                onDrop={handleFilesDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <IconButton color="primary" component="label">
                    <UploadFileIcon fontSize="large" />
                    <input type="file" multiple hidden />
                </IconButton>
                <Typography variant="body2" color="textSecondary">
                    Drop files here or click to upload
                </Typography>
                {files.map((file, index) => (
                    <Typography key={index} variant="body2">
                        {file.name}
                    </Typography>
                ))}
            </Box>
            <Typography variant="body1" gutterBottom>
                Current Size: {currentSize} bytes (60,000 max)
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
    );
};

export default CustomGPTPage;
