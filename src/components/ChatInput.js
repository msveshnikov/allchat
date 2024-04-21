import React from "react";
import { Box, TextField, Button } from "@mui/material";
import FileSelector from "./FileSelector";
import { models } from "./Settings";

const ChatInput = ({ input, setInput, selectedFile, onFileSelect, onSubmit, selectedModel }) => {
    return (
        <Box display="flex" padding={2}>
            <TextField
                data-testid="input-field"
                fullWidth
                label="Enter your question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        onSubmit();
                    }
                }}
                multiline
                minRows={1}
                maxRows={6}
            />
            <FileSelector
                onFileSelect={onFileSelect}
                allowedFileTypes={models[selectedModel]}
                selectedFile={selectedFile}
            />
            <Button variant="contained" color="primary" onClick={onSubmit} style={{ marginLeft: 8 }}>
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;
