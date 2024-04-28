import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { ProfileMenu } from "./ProfileMenu";
import { useTranslation } from "react-i18next";
import { ModelSelector } from "./ModelSelector";

const AppHeader = ({
    isAuthenticated,
    userEmail,
    onSignOut,
    onSettings,
    onOpenAuthModal,
    onToggle,
    selectedModel,
    onModelSelect,
    darkMode,
    toggleTheme,
}) => {
    const { t } = useTranslation();

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onToggle}>
                    <MenuIcon />
                </IconButton>
                <Typography sx={{ ml: 2 }} variant="h6" noWrap>
                    AllChat
                </Typography>
                <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
                <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                    <IconButton aria-label="toggle dark mode" onClick={toggleTheme} color="inherit">
                        {darkMode ? <NightlightIcon /> : <BrightnessHighIcon />}
                    </IconButton>
                    {isAuthenticated ? (
                        <ProfileMenu userEmail={userEmail} onSettings={onSettings} onSignOut={onSignOut} />
                    ) : (
                        <Box component="span" onClick={onOpenAuthModal} sx={{ cursor: "pointer" }}>
                            {t("Login")}
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
