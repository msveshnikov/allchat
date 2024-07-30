import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CircleIcon from "@mui/icons-material/Circle";

const FileSelector = ({ onFileSelect, selectedFile, allowedFileTypes }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        onFileSelect(file);
        event.target.value = null;
    };

    const acceptedFileTypes = allowedFileTypes
        ? allowedFileTypes
              .reduce((acc, type) => {
                  if (type === "image") {
                      acc.push(".png", ".jpeg", ".jpg");
                  } else if (type === "audio") {
                      acc.push(".mp3", ".m4a", ".ogg", ".wav");
                  } else if (type === "video") {
                      acc.push(".mp4");
                  } else if (type === "document") {
                      acc.push(".pdf", ".doc", ".docx", ".xls", ".xlsx");
                  }
                  return acc;
              }, [])
              .join(",")
        : ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpeg,.jpg,.mp4,.mp3,.m4a,.ogg";

    return (
        <Tooltip title="Upload file">
            <div style={{ position: "relative", display: "inline-block" }}>
                <IconButton component="label" color="primary" style={{ position: "relative" }}>
                    <input
                        accept={acceptedFileTypes}
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <AttachFileIcon />
                    {selectedFile && (
                        <CircleIcon
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
