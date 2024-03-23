import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";

const ModelSwitch = ({ onModelChange, model }) => {
    const handleModelChange = (event) => {
        const newModel = event.target.checked ? "claude" : "gemini";
        onModelChange(newModel);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={<Switch checked={model === "claude"} onChange={handleModelChange} color="primary" />}
                label={model === "claude" ? "Claude Haiku" : "Gemini Pro"}
                labelPlacement="start"
            />
        </Box>
    );
};

export default ModelSwitch;
