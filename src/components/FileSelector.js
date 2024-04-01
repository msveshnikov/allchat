import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CircleIcon from "@mui/icons-material/Circle";

const FileSelector = ({ onFileSelect, selectedFile }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        onFileSelect(file);
        event.target.value = null;
    };

    return (
        <Tooltip title="Upload PDF, Word, Excel or image">
            <div style={{ position: "relative", display: "inline-block" }}>
                <IconButton component="label" color="primary" style={{ position: "relative" }}>
                    <input data-testid="file-input"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpeg,.jpg,.mp4"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <AttachFileIcon />
                    {selectedFile && (
                        <CircleIcon
                            data-testid="circle-icon"
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                color: "green",
                                fontSize: "1rem",
                            }}
                        />
                    )}
                </IconButton>
            </div>
        </Tooltip>
    );
};

export default FileSelector;
