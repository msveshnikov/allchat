import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    styled,
    Switch,
    FormControlLabel,
    CircularProgress,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TextField,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Pagination } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserCountriesPieChart from "./UserCountriesPieChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Face2Icon from "@mui/icons-material/Face2";
import LaunchIcon from "@mui/icons-material/Launch";
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
    const [users, setUsers] = useState([]);
    const [sharedChats, setSharedChats] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [loadingGptId, setLoadingGptId] = useState(null);
    const [artifacts, setArtifacts] = useState([]);
    const [selectedArtifact, setSelectedArtifact] = useState(null);
    const [openArtifactDialog, setOpenArtifactDialog] = useState(false);
    const [filteredArtifacts, setFilteredArtifacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTab, setCurrentTab] = useState(0);
    const [usersByCountry, setUsersByCountry] = useState({});

    useEffect(() => {
        const fetchArtifacts = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await fetch(`${API_URL}/artifacts`, {
                headers,
            });
            const data = await response.json();
            setArtifacts(data);
            setFilteredArtifacts(data);
        };
        fetchArtifacts();
    }, []);

    const handleSearchChange = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = artifacts.filter((artifact) => artifact.name.toLowerCase().includes(term));
        setFilteredArtifacts(filtered);
    };

    const handleDeleteArtifact = async (id) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${API_URL}/artifacts/${id}`, {
            method: "DELETE",
            headers,
        });
        if (response.ok) {
            const updatedArtifacts = artifacts.filter((artifact) => artifact._id !== id);
            setArtifacts(updatedArtifacts);

            const updatedFilteredArtifacts = filteredArtifacts.filter((artifact) => artifact._id !== id);
            setFilteredArtifacts(updatedFilteredArtifacts);
        }
    };

    const handleViewArtifact = (artifact) => {
        setSelectedArtifact(artifact);
        setOpenArtifactDialog(true);
    };

    const handleCloseArtifactDialog = () => {
        setOpenArtifactDialog(false);
        setSelectedArtifact(null);
    };

    const handleOpenArtifact = (artifact) => {
        localStorage.setItem("currentArtifact", JSON.stringify(artifact));
        window.open("/artifact", "_blank");
    };

    const generateAvatar = async (id, instructions) => {
        setLoading(true);
        setLoadingGptId(id);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await fetch(`${API_URL}/generate-avatar`, {
                method: "POST",
                headers,
                body: JSON.stringify({ userInput: instructions }),
            });
            if (response.ok) {
                const data = await response.json();
                const updateResponse = await fetch(`${API_URL}/customgpt/${id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({ profileUrl: data.profileUrl }),
                });
                if (updateResponse.ok) {
                    setGpts(gpts.map((gpt) => (gpt._id === id ? { ...gpt, profileUrl: data.profileUrl } : gpt)));
                }
            }
        } finally {
            setLoading(false);
            setLoadingGptId(null);
        }
    };

    useEffect(() => {
        const fetchUsersData = async (page) => {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await fetch(`${API_URL}/users?page=${page}&limit=${itemsPerPage}`, {
                headers,
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            }
        };
        fetchUsersData(currentPage);
    }, [currentPage, itemsPerPage]);

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

    useEffect(() => {
        const fetchSharedChats = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            const response = await fetch(API_URL + "/sharedChats", {
                headers,
            });
            const data = await response.json();
            setSharedChats(data);
        };
        fetchSharedChats();
    }, []);

    const handleDeleteChat = async (chatId) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${API_URL}/sharedChats/${chatId}`, {
            method: "DELETE",
            headers,
        });

        if (response.ok) {
            setSharedChats(sharedChats.filter((chat) => chat._id !== chatId));
        }
    };

    const handleSubscriptionChange = async (userId, newStatus) => {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const response = await fetch(`${API_URL}/users/${userId}/subscription`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ status: newStatus }),
        });
        await response.json();
        if (response.ok) {
            const updatedUsers = users.users.map((user) =>
                user._id === userId ? { ...user, subscriptionStatus: newStatus } : user
            );
            setUsers({ ...users, users: updatedUsers });
        }
    };

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
                setUsersByCountry(statsData.usersByCountry || {}); // Add this line
            }
        };

        fetchStats();
    }, []);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center">
                <Box maxWidth="1200px" width="100%" padding={2}>
                    <Typography variant="h3" gutterBottom align="center" color="primary">
                        Admin Statistics
                    </Typography>
                    {stats ? (
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} md={6} lg={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Users
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total User Count: <strong>{stats.users}</strong>
                                        </Typography>
                                        {stats.subscriptionStats && (
                                            <>
                                                <Typography variant="h6" gutterBottom color="primary" mt={2}>
                                                    Subscription Status
                                                </Typography>
                                                <Typography variant="body1" color="text.primary">
                                                    Active: <strong>{stats.subscriptionStats.active}</strong>
                                                </Typography>
                                                <Typography variant="body1" color="text.primary">
                                                    Past Due: <strong>{stats.subscriptionStats.past_due}</strong>
                                                </Typography>
                                                <Typography variant="body1" color="text.primary">
                                                    Trialing: <strong>{stats.subscriptionStats.trialing}</strong>
                                                </Typography>
                                                <Typography variant="body1" color="text.primary">
                                                    Incomplete: <strong>{stats.subscriptionStats.incomplete}</strong>
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Subscriptions:{" "}
                                                    <strong>{stats.subscriptionStats.subscription}</strong>
                                                </Typography>
                                            </>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Gemini Pro Usage
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
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Claude 3 Usage
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Money Consumed:{" "}
                                            <strong>${stats.claude.totalMoneyConsumed.toFixed(2)}</strong>
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            Together Usage
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Money Consumed:{" "}
                                            <strong>${stats.together.totalMoneyConsumed.toFixed(2)}</strong>
                                        </Typography>
                                    </CardContent>
                                </StyledCard>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom color="primary">
                                            GPT Usage
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Total Money Consumed:{" "}
                                            <strong>${stats.gpt.totalMoneyConsumed.toFixed(2)}</strong>
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

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={currentTab} onChange={handleTabChange} centered>
                    <Tab label="Users" />
                    <Tab label="Custom GPTs" />
                    <Tab label="Shared Chats" />
                    <Tab label="Artifacts" />
                </Tabs>
            </Box>

            {currentTab === 0 && (
                <Box padding={4}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        User Admin
                    </Typography>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Subscription ID</TableCell>
                                    <TableCell>Money</TableCell>
                                    <TableCell>Subscription Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>Created At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.users?.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.ip}</TableCell>
                                        <TableCell>{user.country}</TableCell>
                                        <TableCell>{user.subscriptionId}</TableCell>
                                        <TableCell>
                                            {(
                                                user.usageStats.gemini.moneyConsumed +
                                                user.usageStats.claude.moneyConsumed +
                                                user.usageStats.together.moneyConsumed +
                                                user.usageStats.gpt.moneyConsumed
                                            ).toFixed(2)}
                                        </TableCell>
                                        <TableCell>{user.subscriptionStatus}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() =>
                                                    handleSubscriptionChange(
                                                        user._id,
                                                        user.subscriptionStatus === "active" ? "past_due" : "active"
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            {user.createdAt && new Date(user.createdAt).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={users.totalPages}
                            page={currentPage}
                            onChange={(event, page) => setCurrentPage(page)}
                        />
                    </Box>
                    <UserCountriesPieChart usersByCountry={usersByCountry} />
                </Box>
            )}

            {currentTab === 1 && (
                <Box padding={4}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        Custom GPT Admin
                    </Typography>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Avatar</TableCell>
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
                                        <TableCell>
                                            {gpt?.profileUrl && (
                                                <Box marginRight={1}>
                                                    <img
                                                        src={gpt?.profileUrl}
                                                        alt="User Avatar"
                                                        style={{
                                                            width: "30px",
                                                            height: "30px",
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </TableCell>
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
                                            <Box display="flex" alignItems="center">
                                                <IconButton onClick={() => handleDeleteGpt(gpt._id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() =>
                                                        generateAvatar(
                                                            gpt._id,
                                                            gpt.instructions + gpt.knowledge?.slice(200)
                                                        )
                                                    }
                                                    disabled={loading && loadingGptId === gpt._id}
                                                >
                                                    {loading && loadingGptId === gpt._id ? (
                                                        <CircularProgress size={24} />
                                                    ) : (
                                                        <Face2Icon />
                                                    )}
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {currentTab === 2 && (
                <Box padding={4}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        Shared Chats Admin
                    </Typography>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Chat ID</TableCell>
                                    <TableCell>Owner User Email</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Custom GPT</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sharedChats?.map((chat) => (
                                    <TableRow key={chat._id}>
                                        <TableCell>
                                            <Link
                                                href={`https://allchat.online/chat/${chat._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {chat._id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{chat.userEmail}</TableCell>
                                        <TableCell>{chat.model}</TableCell>
                                        <TableCell>{chat.customGPT}</TableCell>
                                        <TableCell>{new Date(chat.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDeleteChat(chat._id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {currentTab === 3 && (
                <Box padding={4}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        Artifacts Admin
                    </Typography>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Search artifacts by name"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Artifact ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>User Email</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredArtifacts.map((artifact) => (
                                    <TableRow key={artifact._id}>
                                        <TableCell>
                                            <Link
                                                href={`/artifact/${artifact._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {artifact._id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{artifact.name}</TableCell>
                                        <TableCell>{artifact.type}</TableCell>
                                        <TableCell>{artifact.userEmail}</TableCell>
                                        <TableCell>{new Date(artifact.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleViewArtifact(artifact)} color="primary">
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenArtifact(artifact)} color="secondary">
                                                <LaunchIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteArtifact(artifact._id)}
                                                color="error"
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
            )}

            <Dialog open={openArtifactDialog} onClose={handleCloseArtifactDialog} maxWidth="md" fullWidth>
                <DialogTitle>{selectedArtifact?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Type: {selectedArtifact?.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Created: {selectedArtifact && new Date(selectedArtifact.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                        {selectedArtifact?.content}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseArtifactDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Admin;
