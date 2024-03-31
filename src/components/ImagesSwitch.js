import React from "react";
import { Switch, FormControlLabel, Box } from "@mui/material";

const ImagesSwitch = ({ onImagesChange, imagesCount }) => {
    const handleImagesChange = (event) => {
        onImagesChange(event.target.checked ? 4 : 1);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <FormControlLabel
                control={<Switch checked={imagesCount === 4} onChange={handleImagesChange} color="primary" />}
                label={imagesCount === 4 ? "4 Images" : "1 Image"}
                labelPlacement="start"
            />
        </Box>
    );
};

export default ImagesSwitch;
