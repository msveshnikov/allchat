import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";

const ToolsSwitch = ({ onToolsChange, tools }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={
                    <Switch checked={tools} onChange={(event) => onToolsChange(event.target.checked)} color="primary" />
                }
                label="Web Tools"
                labelPlacement="start"
            />
        </Box>
    );
};

export default ToolsSwitch;
