import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const FileUploader = ({ onFileUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onFileUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

export default FileUploader;
