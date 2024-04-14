import React from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import md5 from "md5";
import LaunchIcon from "@mui/icons-material/Launch";

export function ProfileMenu({ userEmail, onMyAccount, onSignOut }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMyAccountClick = () => {
        onMyAccount();
        handleProfileMenuClose();
    };

    const handleSignOutClick = () => {
        onSignOut();
        handleProfileMenuClose();
    };

    const handleMangaTVClick = () => {
        window.open("https://mangatv.shop/", "_blank");
        handleProfileMenuClose();
    };

    const handleGitHubClick = () => {
        window.open("https://github.com/msveshnikov/allchat", "_blank");
        handleProfileMenuClose();
    };

    const handleDiscordClick = () => {
        window.open("https://discord.gg/YOUR_DISCORD_INVITE_LINK", "_blank");
        handleProfileMenuClose();
    };

    return (
        <div>
            <IconButton data-testid="profile" color="inherit" onClick={handleProfileMenuOpen}>
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
                <MenuItem onClick={handleMyAccountClick}>Settings</MenuItem>
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
                <MenuItem onClick={handleMangaTVClick}>
                    Manga TV &nbsp; <LaunchIcon fontSize="small" />
                </MenuItem>
                <MenuItem onClick={handleGitHubClick}>
                    GitHub &nbsp; <LaunchIcon fontSize="small" />
                </MenuItem>
                <MenuItem onClick={handleDiscordClick}>
                    Discord &nbsp; <LaunchIcon fontSize="small" />
                </MenuItem>
            </Menu>
        </div>
    );
}
