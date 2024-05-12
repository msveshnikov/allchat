import React from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import md5 from "md5";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router-dom";

export function ProfileMenu({ userEmail, onSettings, onSignOut }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSettingsClick = () => {
        onSettings();
        handleProfileMenuClose();
    };

    const handleSignOutClick = () => {
        onSignOut();
        handleProfileMenuClose();
    };

    const handleAndroidClick = () => {
        window.open("https://play.google.com/store/apps/details?id=online.allchat.twa", "_blank");
        handleProfileMenuClose();
    };

    const handlePrivacyClick = () => {
        navigate("/privacy");
        handleProfileMenuClose();
    };

    const handleTermsClick = () => {
        navigate("/terms");
        handleProfileMenuClose();
    };

    return (
        <div>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                {userEmail ? (
                    <Avatar
                        src={`https://www.gravatar.com/avatar/${md5(userEmail.trim().toLowerCase())}?d=retro`}
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
                <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
                <MenuItem onClick={handlePrivacyClick}>Privacy</MenuItem>
                <MenuItem onClick={handleTermsClick}>Terms</MenuItem>
                <MenuItem onClick={handleAndroidClick}>
                    Android App &nbsp; <LaunchIcon fontSize="small" />
                </MenuItem>
            </Menu>
        </div>
    );
}
