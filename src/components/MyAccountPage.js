import React from "react";
import { Typography, Card, CardContent, Grid, Avatar, Button, Link } from "@mui/material";
import md5 from "md5";

const MyAccountPage = ({ user, handleCancelSubscription, handleCloseMyAccountModal }) => {
    const gravatarUrl = `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase())}?d=identicon`;

    return (
        <>
            <Avatar
                src={gravatarUrl}
                alt={user.name}
                sx={{
                    width: 100,
                    height: 100,
                    marginBottom: "1rem",
                }}
            />

            <Card
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    backgroundImage: "linear-gradient(to right, #68989e, #9ce1ba)",
                    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    marginBottom: "3rem",
                    transition: "transform 0.3s, box-shadow 0.3s",
                }}
            >
                <CardContent sx={{ padding: "1rem" }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom color="secondary">
                                Email
                            </Typography>
                            <Typography variant="body1" color="#fff">
                                {user.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom color="secondary">
                                Subscription Status
                            </Typography>
                            <Typography variant="body1" color="#fff">
                                {user?.subscriptionStatus?.toUpperCase()}
                            </Typography>
                            {user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing" ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 1 }}
                                    onClick={handleCancelSubscription}
                                >
                                    Cancel Subscription
                                </Button>
                            ) : (
                                <Link
                                    href={
                                        "https://buy.stripe.com/28oaGDclzeEfgUgcMM?prefilled_email=" + user.email
                                    }
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Button
                                        onClick={handleCloseMyAccountModal}
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 1 }}
                                    >
                                        Start Subscription
                                    </Button>
                                </Link>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom color="secondary">
                                Gemini Pro 1.5 Usage
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Input Characters:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>{user.usageStats.gemini.inputCharacters}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Output Characters:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>{user.usageStats.gemini.outputCharacters}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Images Generated:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>{user.usageStats.gemini.imagesGenerated}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Money Consumed:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>${user.usageStats.gemini.moneyConsumed.toFixed(2)}</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom color="secondary">
                                Claude 3 Haiku Usage
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Input Tokens:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>{user.usageStats.claude.inputTokens}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Output Tokens:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>{user.usageStats.claude.outputTokens}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="#fff">
                                        Money Consumed:
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        <b>${user.usageStats.claude.moneyConsumed.toFixed(2)}</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

export default MyAccountPage;
