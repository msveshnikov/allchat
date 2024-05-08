import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const ToolsSwitch = ({ onToolsChange, tools, toolsEnabled }) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={
                    <Switch
                        disabled={!toolsEnabled}
                        checked={toolsEnabled && tools}
                        onChange={(event) => onToolsChange(event.target.checked)}
                        color="primary"
                    />
                }
                label={t("Web Tools")}
                labelPlacement="start"
            />
        </Box>
    );
};

export default ToolsSwitch;
