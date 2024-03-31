import React from "react";
import { List, ListItem, ListItemText, SwipeableDrawer } from "@mui/material";
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
