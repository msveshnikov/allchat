import React from "react";
import { List, ListItem, ListItemText, SwipeableDrawer, Slider, Typography } from "@mui/material";
import SoundSwitch from "./SoundSwitch";
import ToolsSwitch from "./ToolsSwitch";
import { Link } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

const PDFGenerator = () => import("./pdfGenerator");

const SideDrawer = ({
    isOpen,
    onToggle,
    onNewChat,
    storedChatHistories,
    chatHistory,
    onHistorySelection,
    sound,
    onSoundChange,
    tools,
    onToolsChange,
    onClearAll,
    temperature,
    onTemperatureChange,
}) => {
    const handleExportPDF = async () => {
        PDFGenerator().then(({ default: generatePdfFromChatHistories }) => {
            generatePdfFromChatHistories([chatHistory, ...storedChatHistories.map((h) => h.chatHistory)]);
        });
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <SwipeableDrawer
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            PaperProps={{
                sx: {
                    width: isMobile ? 200 : 350,
                },
            }}
            open={isOpen}
            onClose={onToggle}
            onOpen={onToggle}
        >
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
                        <SoundSwitch sound={sound} onSoundChange={onSoundChange} />
                    </ListItem>
                    <ListItem>
                        <ToolsSwitch tools={tools} onToolsChange={onToolsChange} />
                    </ListItem>
                    <ListItem button style={{ color: "white", backgroundColor: "#3057A5" }} onClick={handleExportPDF}>
                        <ListItemText primary="Export history PDF" />
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
