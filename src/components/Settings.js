import React, { useState, useEffect } from "react";
import { Typography, Grid, Avatar, Button, Link, TextField, MenuItem } from "@mui/material";
import md5 from "md5";
import { useTranslation } from "react-i18next";
import { API_URL } from "./Main";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";

export const models = {
    "gemini-1.5-pro-preview-0514": ["image", "audio", "video", "document", "tools"],
    // "gemini-1.5-flash-preview-0514": ["image", "audio", "video", "document", "tools"],
    "gemini-experimental": ["image", "audio", "video", "document", "tools"],
    "gemini-1.0-pro": ["document", "tools"],
    "claude-3-haiku-20240307": ["image", "document", "tools"],
    "claude-3-sonnet-20240229": ["image", "document", "tools"],
    "gpt-3.5-turbo": ["document", "tools"],
    "ft:gpt-3.5-turbo-0125:maxsoft:kate:9T9qrZ1z": ["document",  "admin"],
    "ft:gpt-3.5-turbo-0613:maxsoft:kate:9THBM3sf": ["document",  "admin"],
    "tunedModels/kate-oeubyqxsbmca": ["document", "admin"],
    "gpt-4o": ["image", "document", "tools"],
    "databricks/dbrx-instruct": ["document"],
    "mistralai/Mixtral-8x22B-Instruct-v0.1": ["document"],
    "mistralai/Mixtral-8x7B-Instruct-v0.1": ["document", "tools"],
    "microsoft/WizardLM-2-8x22B": ["document"],
    "meta-llama/Llama-3-70b-chat-hf": ["document"],
};

const Settings = ({ user, handleCancelSubscription, handleCloseSettingsModal, selectedModel, onModelSelect }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const gravatarUrl =
        user?.profileUrl || `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase())}?d=identicon`;

    const [customGPTNames, setCustomGPTNames] = useState([]);
    const [selectedCustomGPT, setSelectedCustomGPT] = useState("");

    const handleModelChange = (event) => {
        onModelSelect(event.target.value);
    };

    const handleCustomGPTChange = (event) => {
        setSelectedCustomGPT(event.target.value);
    };

    useEffect(() => {
        const storedCustomGPT = localStorage.getItem("selectedCustomGPT");
        if (storedCustomGPT) setSelectedCustomGPT(storedCustomGPT);
        fetchCustomGPTNames();
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedCustomGPT", selectedCustomGPT);
    }, [selectedCustomGPT]);

    const fetchCustomGPTNames = async () => {
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
                setCustomGPTNames(data);
            }
        } catch {}
    };

    const handleTermsClick = () => {
        navigate("/terms");
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
                <Avatar
                    src={gravatarUrl}
                    alt={user.name}
                    sx={{
                        width: 80,
                        height: 80,
                    }}
                />
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
                    {customGPTNames?.map((name) => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    );
};

export default Settings;
