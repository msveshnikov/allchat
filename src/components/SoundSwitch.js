import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";

const SoundSwitch = ({ onSoundChange, sound }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={
                    <Switch checked={sound} onChange={(event) => onSoundChange(event.target.checked)} color="primary" />
                }
                label="Sound"
                labelPlacement="start"
            />
        </Box>
    );
};

export default SoundSwitch;
