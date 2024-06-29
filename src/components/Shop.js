import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from "@mui/material";
import { API_URL } from "./Main";

const Shop = () => {
    const [customGPTs, setCustomGPTs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomGPTs = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
                const response = await fetch(`${API_URL}/customgpt`, {
                    headers,
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setCustomGPTs(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching custom GPTs:", error);
                setLoading(false);
            }
        };

        fetchCustomGPTs();
    }, []);

    if (loading) {
        return (
            <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Custom GPT Shop
            </Typography>
            <Grid container spacing={4}>
                {customGPTs.map((gpt) => (
                    <Grid item key={gpt._id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                sx={{
                                    height: 200,
                                    objectFit: "cover",
                                }}
                                image={gpt.profileUrl || "https://via.placeholder.com/200"}
                                alt={gpt.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {gpt.name}
                                </Typography>
                                <Typography>{gpt.instructions}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Shop;
