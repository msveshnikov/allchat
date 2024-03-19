import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const PDFUploader = ({ onPDFUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onPDFUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Tooltip title="Upload PDF">
            <IconButton component="label" color="primary">
                <input accept="application/pdf" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                <AttachFileIcon />
            </IconButton>
        </Tooltip>
    );
};

export default PDFUploader;
