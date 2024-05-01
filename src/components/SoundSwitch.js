import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const SoundSwitch = ({ onSoundChange, sound }) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={
                    <Switch checked={sound} onChange={(event) => onSoundChange(event.target.checked)} color="primary" />
                }
                label={t("Sound")}
                labelPlacement="start"
            />
        </Box>
    );
};

export default SoundSwitch;
