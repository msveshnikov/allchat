import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Typography, Grid, Avatar, Button, Link, TextField, MenuItem, Box, Tooltip, Modal } from "@mui/material";
import md5 from "md5";
import { useTranslation } from "react-i18next";
import { API_URL } from "./Main";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import CoinBalance from "./CoinBalance";

export const models = {
    "gemini-1.5-pro-002": ["image", "audio", "video", "document", "tools"],
    "gemini-pro-experimental": ["image", "audio", "video", "document", "tools"],
    "gemini-1.5-flash-002": ["image", "audio", "video", "document", "tools"],
    "gemini-flash-experimental": ["image", "audio", "video", "document", "tools"],
    "gemini-1.0-pro-002": ["document", "tools"],
    "claude-3-haiku-20240307": ["image", "document", "tools"],
    "claude-3-5-sonnet-20240620": ["image", "document", "tools"],
    "gpt-3.5-turbo": ["document", "tools"],
    "gpt-4o-2024-08-06": ["image", "document", "tools"],
    "gpt-4o-mini": ["image", "document", "tools"],
    "databricks/dbrx-instruct": ["document"],
    "mistralai/Mixtral-8x22B-Instruct-v0.1": ["document"],
    "mistralai/Mixtral-8x7B-Instruct-v0.1": ["document", "tools"],
    "mistral-large-latest": ["document", "tools", "admin"],
    "meta-llama/Llama-3-70b-chat-hf": ["document"],
    "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo": ["document"],
};

const Settings = ({ user, handleCancelSubscription, handleCloseSettingsModal, selectedModel, onModelSelect }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const gravatarUrl =
        user?.profileUrl || `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase())}?d=identicon`;

    const [customGPTs, setCustomGPTs] = useState([]);
    const [selectedCustomGPT, setSelectedCustomGPT] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [openCoinModal, setOpenCoinModal] = useState(false);

    const handleOpenCoinModal = () => {
        setOpenCoinModal(true);
    };

    const handleCloseCoinModal = () => {
        setOpenCoinModal(false);
    };

    const handleModelChange = (event) => {
        onModelSelect(event.target.value);
    };

    const handleCustomGPTChange = (event) => {
        setSelectedCustomGPT(event.target.value);
    };

    useEffect(() => {
        const storedCustomGPT = localStorage.getItem("selectedCustomGPT");
        if (storedCustomGPT) setSelectedCustomGPT(storedCustomGPT);
        fetchCustomGPTs();
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedCustomGPT", selectedCustomGPT);
    }, [selectedCustomGPT]);

    const fetchCustomGPTs = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            const response = await fetch(API_URL + "/customgpt", {
                headers,
            });
            const data = await response.json();
            if (response.ok) {
                setCustomGPTs(data);
            }
        } catch {}
    };

    const handleTermsClick = () => {
        navigate("/terms");
    };

    const handleAchievementClick = (achievement) => {
        setSelectedAchievement(achievement);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAchievement(null);
    };

    return (
        <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom color="primary">
                    {t("Email")}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                    {user.email}
                </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
                <RouterLink to="/avatar">
                    <Avatar
                        src={gravatarUrl}
                        alt={user.name}
                        sx={{
                            width: 80,
                            height: 80,
                        }}
                    />
                </RouterLink>
            </Grid>

            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                    {t("Subscription Status")}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                    {user?.subscriptionStatus?.toUpperCase()}
                </Typography>
                {user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing" ? (
                    <>
                        <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={handleCancelSubscription}>
                            {t("Cancel Subscription")}
                        </Button>
                        <Link
                            href={"https://billing.stripe.com/p/login/9AQ8zd8ZL79E51e000?prefilled_email=" + user.email}
                            target="_blank"
                            rel="noopener"
                        >
                            <Button
                                onClick={handleCloseSettingsModal}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 1, ml: 1 }}
                            >
                                {t("Customer Portal")}
                            </Button>
                        </Link>
                    </>
                ) : (
                    <Link
                        href={
                            (user.subscriptionStatus === "none"
                                ? "https://buy.stripe.com/fZe6qn4T7cw7gUgeUV?prefilled_email="
                                : "https://buy.stripe.com/28oaGDclzeEfgUgcMM?prefilled_email=") + user.email
                        }
                        target="_blank"
                        rel="noopener"
                    >
                        <Button
                            onClick={() => {
                                ReactGA.event({
                                    category: "buy",
                                    action: "begin_checkout",
                                    value: 4.99,
                                });
                                handleCloseSettingsModal();
                            }}
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                        >
                            {t("Start Subscription")}
                        </Button>
                    </Link>
                )}
                <MenuItem onClick={handleTermsClick}>Terms</MenuItem>
            </Grid>

            <Grid item xs={12} md={12}>
                <Box display="flex" flexWrap="wrap">
                    <CoinBalance onClick={handleOpenCoinModal} coins={user?.coins} />
                    {user.achievements.map((achievement, index) => (
                        <Tooltip key={index} title={achievement.description}>
                            <span
                                key={index}
                                style={{ fontSize: "1.5rem", marginRight: "0.5rem", cursor: "pointer" }}
                                onClick={() => handleAchievementClick(achievement)}
                            >
                                {achievement?.emoji?.slice(0, 2)}
                            </span>
                        </Tooltip>
                    ))}
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                    {t("Select Model")}
                </Typography>
                <TextField
                    value={selectedModel}
                    onChange={handleModelChange}
                    fullWidth
                    select
                    variant="outlined"
                    color="primary"
                >
                    {Object.keys(models)
                        .filter((model) => user.admin || !models[model].includes("admin"))
                        .map((model) => (
                            <MenuItem key={model} value={model}>
                                {model}
                            </MenuItem>
                        ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                    {t("Select Custom GPT")}
                </Typography>
                <TextField
                    value={selectedCustomGPT}
                    onChange={handleCustomGPTChange}
                    fullWidth
                    select
                    variant="outlined"
                    color="primary"
                >
                    <MenuItem value="">None</MenuItem>
                    {customGPTs?.map((customGPT) => (
                        <MenuItem key={customGPT.name} value={customGPT.name}>
                            <Box display="flex" alignItems="center">
                                {customGPT?.profileUrl && (
                                    <Box marginRight={1}>
                                        <img
                                            src={customGPT.profileUrl}
                                            alt="User Avatar"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    </Box>
                                )}
                                {customGPT.name}
                            </Box>
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {selectedAchievement && (
                        <>
                            <Typography color="primary" variant="h6" gutterBottom>
                                Achievement
                            </Typography>
                            <Typography color="primary" variant="body1" gutterBottom>
                                {selectedAchievement.description}
                            </Typography>
                            <Typography color="primary" variant="h4" gutterBottom>
                                {selectedAchievement?.emoji?.slice(0, 2)}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
            <Modal open={openCoinModal} onClose={handleCloseCoinModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography color="primary" variant="h6" gutterBottom>
                        About Coins
                    </Typography>
                    <Typography color="primary" variant="body1" gutterBottom>
                        Coins are earned for activities such as sharing chats, creating custom GPTs, and achievements.
                    </Typography>
                    <Typography color="secondary" variant="body1" gutterBottom>
                        Coins unlock amazing AI Avatars and beyond!
                    </Typography>
                </Box>
            </Modal>
        </Grid>
    );
};

export default Settings;
