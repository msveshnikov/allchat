import React from "react";
import { MenuItem, Box } from "@mui/material";

const ColorMenuItem = ({ color, ...props }) => (
    <MenuItem {...props}>
        <Box
            sx={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                backgroundColor: color,
                marginRight: "8px",
                borderRadius: "4px",
            }}
        />
        {props.children}
    </MenuItem>
);

export default ColorMenuItem;
