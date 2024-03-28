import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, styled } from "@mui/material";
import { API_URL } from "./Main";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

const StatsPage = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            const response = await fetch(`${API_URL}/stats`, {
                method: "GET",
                headers,
            });

            if (response.ok) {
                const statsData = await response.json();
                setStats(statsData);
            }
        };

        fetchStats();
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Box maxWidth="800px" width="100%">
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Admin Statistics
                </Typography>
                {stats ? (
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Gemini Pro 1.5 Usage
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Input Characters: {stats.gemini.totalInputCharacters}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Output Characters: {stats.gemini.totalOutputCharacters}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Images Generated: {stats.gemini.totalImagesGenerated}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Money Consumed: ${stats.gemini.totalMoneyConsumed.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Claude 3 Haiku Usage
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Input Tokens: {stats.claude.totalInputTokens}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Output Tokens: {stats.claude.totalOutputTokens}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Total Money Consumed: ${stats.claude.totalMoneyConsumed.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1" align="center">
                        Loading...
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default StatsPage;
