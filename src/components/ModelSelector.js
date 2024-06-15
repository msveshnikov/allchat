import React, { useState } from "react";
import { Typography, Menu, MenuItem, useTheme } from "@mui/material";
import { models } from "./Settings";

export const ModelSelector = ({ selectedModel, onModelSelect, user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleModelSelect = (model) => {
        onModelSelect(model);
        handleClose();
    };

    return (
        <div>
            <Typography
                variant="body1"
                component="span"
                onClick={handleClick}
                style={{
                    fontSize: "0.9rem",
                    color: theme.palette.modelName,
                    marginLeft: "0.5rem",
                    cursor: "pointer",
                }}
            >
                {selectedModel}
            </Typography>
            <Menu
                id="model-selector-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "model-selector-button",
                }}
            >
                {Object.keys(models)
                    .filter((model) => user?.admin || !models[model].includes("admin"))
                    .map((model) => (
                        <MenuItem key={model} onClick={() => handleModelSelect(model)}>
                            {model}
                        </MenuItem>
                    ))}
            </Menu>
        </div>
    );
};
