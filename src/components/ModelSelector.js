import React, { useEffect, useState } from "react";
import { Typography, Menu, MenuItem } from "@mui/material";
import { models } from "./Settings";

export const ModelSelector = ({ openSettingsModal }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedModel, setSelectedModel] = useState();

    useEffect(() => {
        const storedModel = localStorage.getItem("selectedModel") || "gemini-1.5-pro-latest";
        if (storedModel) setSelectedModel(storedModel);
    }, [openSettingsModal]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        localStorage.setItem("selectedModel", model);
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
                    color: "#c5c5c5",
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
                {models.map((model) => (
                    <MenuItem key={model} onClick={() => handleModelSelect(model)}>
                        {model}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};
