import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import NightlightIcon from "@mui/icons-material/Nightlight";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ProfileMenu } from "./ProfileMenu";
import { useTranslation } from "react-i18next";
import { ModelSelector } from "./ModelSelector";

const AppHeader = ({
    isAuthenticated,
    userEmail,
    user,
    onSignOut,
    onSettings,
    onOpenAuthModal,
    onToggle,
    selectedModel,
    onModelSelect,
    themeMode,
    toggleTheme,
    onInviteUser,
    chatId,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const renderThemeIcon = () => {
        switch (themeMode) {
            case "light":
                return <BrightnessHighIcon />;
            case "dark":
                return <NightlightIcon />;
            case "third":
                return <ColorLensIcon />;
            default:
                return <BrightnessHighIcon />;
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onToggle}>
                    <MenuIcon />
                </IconButton>
                {!isMobile && (
                    <Typography sx={{ ml: 2 }} variant="h6" noWrap>
                        AllChat Premium
                    </Typography>
                )}
                <ModelSelector user={user} selectedModel={selectedModel} onModelSelect={onModelSelect} />
                <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                    <IconButton
                        aria-label="invite user"
                        onClick={onInviteUser}
                        color={chatId ? "secondary" : "inherit"}
                        sx={{ mr: 1 }}
                    >
                        <PersonAddIcon />
                    </IconButton>
                    <IconButton aria-label="toggle theme" onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                        {renderThemeIcon()}
                    </IconButton>
                    {isAuthenticated ? (
                        <ProfileMenu userEmail={userEmail} user={user} onSettings={onSettings} onSignOut={onSignOut} />
                    ) : (
                        <Box component="span" onClick={onOpenAuthModal} sx={{ cursor: "pointer" }}>
                            <Typography>{t("Login")}</Typography>
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
