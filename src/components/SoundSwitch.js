import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";

const SoundSwitch = ({ onSoundChange, sound }) => {
    const handleModelChange = (event) => {
        onSoundChange(event.target.checked);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={<Switch checked={sound} onChange={handleModelChange} color="primary" />}
                label="Sound"
                labelPlacement="start"
            />
        </Box>
    );
};

export default SoundSwitch;
