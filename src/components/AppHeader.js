import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
    openSettingsModal,
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
                <ModelSelector openSettingsModal={openSettingsModal} />
                <Box sx={{ ml: "auto" }}>
                    {isAuthenticated ? (
                        <ProfileMenu userEmail={userEmail} onSettings={onSettings} onSignOut={onSignOut} />
                    ) : (
                        <Button color="inherit" onClick={onOpenAuthModal}>
                            {t("Login")}
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
