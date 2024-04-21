import React, { lazy } from "react";
import { List, ListItem, ListItemText, SwipeableDrawer, Slider, Typography } from "@mui/material";
import SoundSwitch from "./SoundSwitch";
import ImagesSwitch from "./ImagesSwitch";
import ToolsSwitch from "./ToolsSwitch";
import { Link } from "react-router-dom";
import { generatePdfFromChatHistories } from "./pdfGenerator";
// const PdfGenerator = lazy(() => import("./pdfGenerator"));

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
    const handleExportPDF = async () => {
        // const { generatePdfFromChatHistories } = await PdfGenerator;
        // generatePdfFromChatHistories(storedChatHistories);
        await generatePdfFromChatHistories(storedChatHistories);
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
                    <ListItem button style={{ color: "white", backgroundColor: "#0057F5" }} onClick={handleExportPDF}>
                        <ListItemText primary="Export PDF" />
                    </ListItem>
                </div>
                <Link to="/custom" style={{ color: "white", backgroundColor: "#30A557", textDecoration: "none" }}>
                    <ListItem button>
                        <ListItemText primary="Custom GPT" />
                    </ListItem>
                </Link>
                <ListItem button onClick={onClearAll} style={{ color: "white", backgroundColor: "#F50057" }}>
                    <ListItemText primary="Clear All" />
                </ListItem>
            </div>
        </SwipeableDrawer>
    );
};

export default SideDrawer;
