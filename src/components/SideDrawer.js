import React from "react";
import { List, ListItem, ListItemText, SwipeableDrawer, Slider, Typography } from "@mui/material";
import SoundSwitch from "./SoundSwitch";
import ImagesSwitch from "./ImagesSwitch";
import ToolsSwitch from "./ToolsSwitch";

const SideDrawer = ({
    isOpen,
    onToggle,
    onNewChat,
    storedChatHistories,
    onHistorySelection,
    sound,
    onSoundChange,
    tools,
    onToolsChange,
    onClearAll,
    numberOfImages,
    onImagesChange,
    temperature,
    onTemperatureChange,
}) => {
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
                            sx={{ mr: 1, ml: 2 }}
                            value={temperature}
                            onChange={(event, newValue) => onTemperatureChange(newValue)}
                            min={0}
                            max={1}
                            step={0.1}
                            valueLabelDisplay="auto"
                        />
                    </ListItem>
                    <ListItem>
                        <ImagesSwitch numberOfImages={numberOfImages} onImagesChange={onImagesChange} />
                    </ListItem>
                    <ListItem>
                        <SoundSwitch sound={sound} onSoundChange={onSoundChange} />
                    </ListItem>
                    <ListItem>
                        <ToolsSwitch tools={tools} onToolsChange={onToolsChange} />
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
