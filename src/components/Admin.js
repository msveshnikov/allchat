import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, styled, Switch, FormControlLabel } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "./Main";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[3],
}));

const Admin = () => {
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

    const handlePrivateGpt = async (id, isPrivate) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${API_URL}/customgpt/${id}/private`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ isPrivate }),
        });
        const data = await response.json();
        if (response.ok) {
            const updatedGpts = gpts.map((gpt) => (gpt._id === id ? { ...gpt, isPrivate } : gpt));
            setGpts(updatedGpts);
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
            <Box display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5">
                <Box maxWidth="1200px" width="100%" padding={4}>
                    <Typography variant="h3" gutterBottom align="center" color="primary">
                        Admin Statistics
                    </Typography>
                    {stats ? (
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={6} lg={4}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Gemini Pro Usage
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Input Tokens: <strong>{stats.gemini.totalInputTokens}</strong>
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Output Tokens: <strong>{stats.gemini.totalOutputTokens}</strong>
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Images Generated: <strong>{stats.gemini.totalImagesGenerated}</strong>
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Money Consumed:{" "}
                                            <strong>${stats.gemini.totalMoneyConsumed.toFixed(2)}</strong>
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Claude 3 Haiku Usage
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Input Tokens: <strong>{stats.claude.totalInputTokens}</strong>
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Output Tokens: <strong>{stats.claude.totalOutputTokens}</strong>
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Money Consumed:{" "}
                                            <strong>${stats.claude.totalMoneyConsumed.toFixed(2)}</strong>
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Users
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total User Count: <strong>{stats.users}</strong>
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
            <Box bgcolor="#f5f5f5" padding={4}>
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Custom GPT Admin
                </Typography>
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Instructions</TableCell>
                                <TableCell>Knowledge</TableCell>
                                <TableCell>Private</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gpts?.map((gpt) => (
                                <TableRow key={gpt._id}>
                                    <TableCell>{gpt.name}</TableCell>
                                    <TableCell>{gpt.instructions?.slice(0, 500)}</TableCell>
                                    <TableCell>{gpt.knowledge?.slice(0, 1500)}</TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={gpt.isPrivate}
                                                    onChange={() => handlePrivateGpt(gpt._id, !gpt.isPrivate)}
                                                />
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleDeleteGpt(gpt._id)}
                                            color="error"
                                            data-testid="delete-gpt-button"
                                        >
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

export default Admin;
