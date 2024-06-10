import React, { useEffect, useState } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box,
} from "@mui/material";
import { API_URL } from "./Main";
import { useNavigate } from "react-router-dom";
import ColorMenuItem from "./ColorMenuItem";
import CoinBalance from "./CoinBalance";

const AvatarBuilder = () => {
    const [userInput, setUserInput] = useState("");
    const [user, setUser] = useState();
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [outfit, setOutfit] = useState("");
    const [hairstyle, setHairstyle] = useState("");
    const [sport, setSport] = useState("");
    const [background, setBackground] = useState("");
    const [animal, setAnimal] = useState("");
    const [gender, setGender] = useState("");
    const [skinColor, setSkinColor] = useState("");
    const [drawingStyle, setDrawingStyle] = useState("");
    const [openCoinModal, setOpenCoinModal] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

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

    const handleSkinColorChange = (event) => {
        setSkinColor(event.target.value);
    };

    const handleDrawingStyleChange = (event) => {
        setDrawingStyle(event.target.value);
    };

    const handleOpenCoinModal = () => {
        setOpenCoinModal(true);
    };

    const handleCloseCoinModal = () => {
        setOpenCoinModal(false);
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${API_URL}/user`, {
            method: "GET",
            headers,
        });
        if (response.ok) {
            const userData = await response.json();
            setAvatar(userData.profileUrl);
            setUser(userData);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const generateAvatar = async () => {
        if (user?.coins < 50) {
            handleOpenCoinModal();
            return;
        }
        setUser({ ...user, coins: user.coins - 50 });
        const audio = new Audio("/coin_clink.mp3");
        audio.play();
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
                    gender,
                    skinColor,
                    drawingStyle,
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
                            <MenuItem value="chinchilla">Chinchilla</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select labelId="gender-label" value={gender} onChange={handleGenderChange} label="Gender">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="non-binary">Non-binary</MenuItem>
                            <MenuItem value="genderfluid">Genderfluid</MenuItem>
                            <MenuItem value="agender">Agender</MenuItem>
                            <MenuItem value="bigender">Bigender</MenuItem>
                            <MenuItem value="transgender-male">Transgender Male</MenuItem>
                            <MenuItem value="transgender-female">Transgender Female</MenuItem>
                            <MenuItem value="lgbtq+">LGBTQ+</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="skin-color-label">Skin Color</InputLabel>
                        <Select
                            labelId="skin-color-label"
                            value={skinColor}
                            onChange={handleSkinColorChange}
                            label="Skin Color"
                        >
                            <MenuItem value="">None</MenuItem>
                            <ColorMenuItem value="Light" color="#FFE0BD">
                                Light
                            </ColorMenuItem>
                            <ColorMenuItem value="Medium" color="#EDB98A">
                                Medium
                            </ColorMenuItem>
                            <ColorMenuItem value="Dark" color="#B47D64">
                                Dark
                            </ColorMenuItem>
                            <ColorMenuItem value="Olive" color="#C2B280">
                                Olive
                            </ColorMenuItem>
                            <ColorMenuItem value="Brown" color="#9A6E51">
                                Brown
                            </ColorMenuItem>
                            <ColorMenuItem value="Black" color="#3C3C3C">
                                Black
                            </ColorMenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="drawing-style-label">Drawing Style</InputLabel>
                        <Select
                            labelId="drawing-style-label"
                            value={drawingStyle}
                            onChange={handleDrawingStyleChange}
                            label="Drawing Style"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="realistic">Realistic</MenuItem>
                            <MenuItem value="cartoon">Cartoon</MenuItem>
                            <MenuItem value="anime">Anime</MenuItem>
                            <MenuItem value="sketch">Sketch</MenuItem>
                            <MenuItem value="pixel-art">Pixel Art</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateAvatar}
                            disabled={loading}
                            sx={{ mr: 2 }}
                        >
                            {loading ? "Generating..." : "Generate Avatar"}
                        </Button>
                        <CoinBalance coins={user?.coins} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {loading ? (
                        <CircularProgress />
                    ) : avatar ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Avatar src={avatar} alt="Generated Avatar" sx={{ m: 5, width: 192, height: 192 }} />
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
            <Dialog open={openCoinModal} onClose={handleCloseCoinModal}>
                <DialogTitle>Not Enough Coins</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You need at least 50 coins to generate an avatar. Please earn more coins and try again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCoinModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AvatarBuilder;
