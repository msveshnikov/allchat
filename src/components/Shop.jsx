import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    CircularProgress,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./Main";

const Shop = () => {
    const [customGPTs, setCustomGPTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomGPTs = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
                const response = await fetch(`${API_URL}/customgpt-all`, {
                    headers,
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                const sortedGPTs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setCustomGPTs(sortedGPTs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching custom GPTs:", error);
                setLoading(false);
            }
        };

        fetchCustomGPTs();
    }, []);

    const handleTryMe = (gptName) => {
        localStorage.setItem("selectedCustomGPT", gptName);
        navigate("/");
    };

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
                                <Typography>{gpt.instructions.split(" ").slice(0, 20).join(" ")}...</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleTryMe(gpt.name)}>
                                    Try me
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Shop;
