import React from "react";
import { Box, TextField, Button } from "@mui/material";
import FileSelector from "./FileSelector";

const ChatInput = ({ input, setInput, selectedFile, onFileSelect, onSubmit }) => {
    return (
        <Box display="flex" padding={2}>
            <TextField
                fullWidth
                label="Enter your question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        onSubmit();
                    }
                }}
            />
            <FileSelector onFileSelect={onFileSelect} selectedFile={selectedFile} />
            <Button variant="contained" color="primary" onClick={onSubmit} style={{ marginLeft: 8 }}>
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;
