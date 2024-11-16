import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const ViewToggle = ({ view, handleViewChange }) => (
    <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="view"
        size="small"
        sx={{ mb: 2, mt: -3 }}
    >
        <ToggleButton value="preview" aria-label="preview">
            Preview
        </ToggleButton>
        <ToggleButton value="code" aria-label="code">
            Code
        </ToggleButton>
    </ToggleButtonGroup>
);
