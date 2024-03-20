import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const FileSelector = ({ onFileSelect }) => {
    const handleFileChange = (event) => {
        onFileSelect(event.target.files[0]);
    };

    return (
        <Tooltip title="Upload PDF, Word, Excel">
            <IconButton component="label" color="primary">
                <input
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <AttachFileIcon />
            </IconButton>
        </Tooltip>
    );
};

export default FileSelector;
