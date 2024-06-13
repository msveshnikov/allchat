import React, { useState } from "react";
import { Typography, TextField, Box, Button, IconButton, useTheme } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { API_URL } from "./Main";

const CustomGPTPage = () => {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [files, setFiles] = useState([]);
    const [currentSize, setCurrentSize] = useState(0);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const theme = useTheme();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleInstructionsChange = (e) => {
        setInstructions(e.target.value);
    };

    const handleFilesDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const updatedFiles = [...files, ...droppedFiles];
        setFiles(updatedFiles);
    };

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        const updatedFiles = [...files, ...uploadedFiles];
        setFiles(updatedFiles);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Name cannot be empty");
            setSuccessMessage("");
            return;
        }

        if (!instructions.trim()) {
            setError("Instructions cannot be empty");
            setSuccessMessage("");
            return;
        }

        const filesBase64 = await Promise.all(
            files.map(async (file) => {
                const base64 = await convertToBase64(file);
                return base64;
            })
        );

        const formData = {
            name,
            instructions,
            files: filesBase64,
        };

        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${API_URL}/customgpt`, {
            method: "POST",
            headers,
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            setError("");
            setSuccessMessage(data.message);
            setCurrentSize(data.currentSize);

            const avatarResponse = await fetch(`${API_URL}/generate-avatar`, {
                method: "POST",
                headers,
                body: JSON.stringify({ userInput: instructions }),
            });

            if (avatarResponse.ok) {
                const avatarData = await avatarResponse.json();
                fetch(`${API_URL}/customgpt/${data._id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({ profileUrl: avatarData.profileUrl }),
                });
            }
        } else {
            setError(data.error);
            setSuccessMessage("");
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
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
            <Typography variant="h4" gutterBottom color={theme.palette.text.primary}>
                Custom GPT
            </Typography>
            <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                margin="normal"
                InputProps={{
                    style: {
                        color: theme.palette.text.primary,
                    },
                }}
            />
            <TextField
                label="Instructions"
                value={instructions}
                onChange={handleInstructionsChange}
                multiline
                rows={10}
                fullWidth
                margin="normal"
                InputProps={{
                    style: {
                        color: theme.palette.text.primary,
                    },
                }}
            />
            <Box
                sx={{
                    border: `2px dashed ${theme.palette.text.secondary}`,
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
                <label htmlFor="file-input">
                    <IconButton color="primary" component="span">
                        <UploadFileIcon fontSize="large" />
                    </IconButton>
                </label>
                <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                />
                <Typography variant="body2" color={theme.palette.text.secondary}>
                    Drag and drop knowledge files here or click to upload
                </Typography>
                {files.map((file, index) => (
                    <Typography key={index} variant="body2" color={theme.palette.text.primary}>
                        {file.name}
                    </Typography>
                ))}
            </Box>
            <Typography variant="body1" gutterBottom color={theme.palette.text.primary}>
                Current Size: {currentSize} bytes (60,000 max)
            </Typography>
            {error && (
                <Typography variant="body1" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            {successMessage && (
                <Typography variant="body1" color={theme.palette.success.main} gutterBottom>
                    {successMessage}
                </Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
    );
};

export default CustomGPTPage;
