import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Grid,
    Avatar,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container,
    useTheme,
} from "@mui/material";
import { API_URL } from "./Main";
import { useNavigate } from "react-router-dom";

const AvatarBuilder = () => {
    const [userInput, setUserInput] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [outfit, setOutfit] = useState("");
    const [hairstyle, setHairstyle] = useState("");
    const [sport, setSport] = useState("");
    const [background, setBackground] = useState("");
    const [animal, setAnimal] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleOutfitChange = (event) => {
        setOutfit(event.target.value);
    };

    const handleHairstyleChange = (event) => {
        setHairstyle(event.target.value);
    };

    const handleSportChange = (event) => {
        setSport(event.target.value);
    };

    const handleBackgroundChange = (event) => {
        setBackground(event.target.value);
    };

    const handleAnimalChange = (event) => {
        setAnimal(event.target.value);
    };

    const generateAvatar = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await fetch(API_URL + "/generate-avatar", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    userInput,
                    outfit,
                    hairstyle,
                    sport,
                    background,
                    animal,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAvatar(data.profileUrl);
            }
        } finally {
            setLoading(false);
        }
    };

    const useAvatar = async () => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(API_URL + "/user", {
            method: "PUT",
            headers,
            body: JSON.stringify({ profileUrl: avatar }),
        });

        if (response.ok) {
            navigate("/");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Typography variant="h4" color={theme.palette.text.primary} sx={{ mb: 3 }}>
                AI Avatar Builder
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Describe your avatar or just select below options"
                        variant="outlined"
                        fullWidth
                        value={userInput}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="outfit-label">Outfit</InputLabel>
                        <Select labelId="outfit-label" value={outfit} onChange={handleOutfitChange} label="Outfit">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="casual">Casual</MenuItem>
                            <MenuItem value="formal">Formal</MenuItem>
                            <MenuItem value="athletic">Athletic</MenuItem>
                            <MenuItem value="business">Business</MenuItem>
                            <MenuItem value="superhero">Superhero</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="hairstyle-label">Hairstyle</InputLabel>
                        <Select
                            labelId="hairstyle-label"
                            value={hairstyle}
                            onChange={handleHairstyleChange}
                            label="Hairstyle"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="short">Short</MenuItem>
                            <MenuItem value="long">Long</MenuItem>
                            <MenuItem value="curly">Curly</MenuItem>
                            <MenuItem value="bald">Bald</MenuItem>
                            <MenuItem value="mohawk">Mohawk</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="sport-label">Sport</InputLabel>
                        <Select labelId="sport-label" value={sport} onChange={handleSportChange} label="Sport">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="soccer">Soccer</MenuItem>
                            <MenuItem value="basketball">Basketball</MenuItem>
                            <MenuItem value="tennis">Tennis</MenuItem>
                            <MenuItem value="golf">Golf</MenuItem>
                            <MenuItem value="swimming">Swimming</MenuItem>
                            <MenuItem value="running">Running</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="background-label">Background</InputLabel>
                        <Select
                            labelId="background-label"
                            value={background}
                            onChange={handleBackgroundChange}
                            label="Background"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="beach">Beach</MenuItem>
                            <MenuItem value="city">City</MenuItem>
                            <MenuItem value="nature">Nature</MenuItem>
                            <MenuItem value="space">Space</MenuItem>
                            <MenuItem value="underwater">Underwater</MenuItem>
                            <MenuItem value="futuristic">Futuristic</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="animal-label">Animal</InputLabel>
                        <Select labelId="animal-label" value={animal} onChange={handleAnimalChange} label="Animal">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="dog">Dog</MenuItem>
                            <MenuItem value="cat">Cat</MenuItem>
                            <MenuItem value="bird">Bird</MenuItem>
                            <MenuItem value="lion">Lion</MenuItem>
                            <MenuItem value="panda">Panda</MenuItem>
                            <MenuItem value="unicorn">Unicorn</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={generateAvatar} disabled={loading}>
                        {loading ? "Generating..." : "Generate Avatar"}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {loading ? (
                        <CircularProgress />
                    ) : avatar ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Avatar src={avatar} alt="Generated Avatar" sx={{ width: 250, height: 250 }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="secondary" onClick={useAvatar}>
                                    Use this Avatar
                                </Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Typography variant="body1">
                            No avatar generated yet. Enter a description and click "Generate Avatar".
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default AvatarBuilder;
