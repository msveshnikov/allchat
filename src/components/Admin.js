import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, styled } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "./Main";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

const StatsPage = () => {
    const [stats, setStats] = useState(null);
    const [gpts, setGpts] = useState([]);

    useEffect(() => {
        const fetchGpts = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await fetch(`${API_URL}/customgpt-details`, {
                headers,
            });
            const data = await response.json();
            setGpts(data);
        };
        fetchGpts();
    }, []);

    const handleDeleteGpt = async (id) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${API_URL}/customgpt/${id}`, {
            method: "DELETE",
            headers,
        });
        const data = await response.json();
        if (response.ok) {
            setGpts(gpts.filter((gpt) => gpt._id !== id));
        } else {
            console.error(data.error);
        }
    };

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
        <>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box maxWidth="800px" width="100%">
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        Admin Statistics
                    </Typography>
                    {stats ? (
                        <Grid container spacing={2} justifyContent="left">
                            <Grid item xs={12} md={6}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            Gemini Pro 1.5 Usage
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Input Tokens: {stats.gemini.totalInputTokens}
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Output Tokens: {stats.gemini.totalOutputTokens}
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
                            <Grid item xs={12} md={6}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            Users
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total User Count: {stats.users}
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
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Custom GPT Admin
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Instructions</TableCell>
                                <TableCell>Knowledge</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gpts?.map((gpt) => (
                                <TableRow key={gpt.id}>
                                    <TableCell>{gpt.name}</TableCell>
                                    <TableCell>{gpt.instructions}</TableCell>
                                    <TableCell>{gpt.knowledge?.slice(0, 1500)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteGpt(gpt._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default StatsPage;
