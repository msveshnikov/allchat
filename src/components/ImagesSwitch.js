import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";

const ImagesSwitch = ({ onImagesChange, numberOfImages }) => {
    const handleImagesChange = (event) => {
        onImagesChange(event.target.checked ? 4 : 1);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={<Switch checked={numberOfImages === 4} onChange={handleImagesChange} color="primary" />}
                label={numberOfImages === 4 ? "4 Images" : "1 Image"}
                labelPlacement="start"
            />
        </Box>
    );
};

export default ImagesSwitch;
