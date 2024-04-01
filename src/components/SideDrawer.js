import React from "react";
import { List, ListItem, ListItemText, SwipeableDrawer, Slider, Typography } from "@mui/material";
import ModelSwitch from "./ModelSwitch";
import SoundSwitch from "./SoundSwitch";
import ImagesSwitch from "./ImagesSwitch";

const SideDrawer = ({
    isOpen,
    onToggle,
    onNewChat,
    storedChatHistories,
    onHistorySelection,
    model,
    onModelChange,
    sound,
    onSoundChange,
    onClearAll,
    imagesCount,
    onImagesChange,
    temperature,
    onTemperatureChange,
}) => {
    const handleTemperatureChange = (event, newValue) => {
        onTemperatureChange(newValue);
    };

    return (
        <SwipeableDrawer PaperProps={{ sx: { width: 200 } }} open={isOpen} onClose={onToggle} onOpen={onToggle}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <List style={{ flexGrow: 1, overflowY: "auto" }}>
                    <ListItem button onClick={onNewChat}>
                        <ListItemText primary="New Chat" />
                    </ListItem>
                    {storedChatHistories.map((history, index) => (
                        <ListItem button key={index} onClick={() => onHistorySelection(index)}>
                            <ListItemText primary={history.summary} />
                        </ListItem>
                    ))}
                </List>
                <div style={{ marginBottom: "auto" }}>
                    <ListItem>
                        <Typography gutterBottom>Temp</Typography>
                        <Slider
                            sx={{ mr: 1, ml: 1 }}
                            value={temperature}
                            onChange={handleTemperatureChange}
                            min={0}
                            max={1}
                            step={0.1}
                            valueLabelDisplay="auto"
                        />
                    </ListItem>
                    <ListItem>
                        <ImagesSwitch imagesCount={imagesCount} onImagesChange={onImagesChange} />
                    </ListItem>
                    <ListItem>
                        <SoundSwitch sound={sound} onSoundChange={onSoundChange} />
                    </ListItem>
                    <ListItem>
                        <ModelSwitch model={model} onModelChange={onModelChange} />
                    </ListItem>
                </div>
                <ListItem button onClick={onClearAll} style={{ color: "white", backgroundColor: "#F50057" }}>
                    <ListItemText primary="Clear All" />
                </ListItem>
            </div>
        </SwipeableDrawer>
    );
};

export default SideDrawer;
