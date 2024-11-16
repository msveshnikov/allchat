import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import FileSelector from "./FileSelector";
import { models } from "./Settings";
import { useTranslation } from "react-i18next";

const ChatInput = ({
    input,
    setInput,
    selectedFile,
    onFileSelect,
    onSubmit,
    selectedModel,
    pastedImage,
    setPastedImage,
}) => {
    const { t } = useTranslation();
    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
                const file = items[i].getAsFile();
                setPastedImage(file);
                break;
            }
        }
    };

    return (
        <Box display="flex" padding={2}>
            <Box display="flex" flexDirection="column" width="100%">
                <span id="rewardId" />
                <TextField
                    fullWidth
                    label={t("Enter your question")}
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
                    onPaste={handlePaste}
                />

                {pastedImage && (
                    <Box mt={2}>
                        <Typography variant="subtitle2">Pasted Image:</Typography>
                        <img
                            src={URL.createObjectURL(pastedImage)}
                            alt="Pasted"
                            width="100"
                            height="100"
                            style={{ objectFit: "contain" }}
                        />
                    </Box>
                )}
            </Box>
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
