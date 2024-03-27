import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Button, Menu, MenuItem, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import md5 from "md5";

const AppHeader = ({ isAuthenticated, userEmail, onSignOut, onOpenAuthModal, onToggle }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMangaTVClick = () => {
        window.open("https://mangatv.shop/", "_blank");
      };

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
                        <div>
                            <IconButton data-testid="profile" color="inherit" onClick={handleProfileMenuOpen}>
                                {userEmail ? (
                                    <Avatar
                                        src={`https://www.gravatar.com/avatar/${md5(
                                            userEmail.trim().toLowerCase()
                                        )}?d=retro`}
                                        alt="User Avatar"
                                    />
                                ) : (
                                    <AccountCircleIcon />
                                )}
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
                                <MenuItem onClick={handleMangaTVClick}>Manga TV</MenuItem>
                            </Menu>
                        </div>
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
