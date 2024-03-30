import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ProfileMenu } from "./ProfileMenu";

const AppHeader = ({ isAuthenticated, userEmail, onSignOut, onMyAccount, onOpenAuthModal, onToggle }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onToggle}>
                    <MenuIcon />
                </IconButton>
                <Typography sx={{ ml: 2 }} variant="h6" noWrap>
                    AllChat
                </Typography>
                <Box sx={{ ml: "auto" }}>
                    {isAuthenticated ? (
                        <ProfileMenu userEmail={userEmail} onMyAccount={onMyAccount} onSignOut={onSignOut} />
                    ) : (
                        <Button color="inherit" onClick={onOpenAuthModal}>
                            Sign In
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
