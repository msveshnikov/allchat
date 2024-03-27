import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const MyAccountPage = ({ user }) => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                My Account
            </Typography>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Email
                            </Typography>
                            <Typography variant="body1">{user.email}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Gemini Pro 1.5 Usage
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Input Characters:</Typography>
                                    <Typography variant="body2">{user.usageStats.gemini.inputCharacters}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Output Characters:</Typography>
                                    <Typography variant="body2">{user.usageStats.gemini.outputCharacters}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Images Generated:</Typography>
                                    <Typography variant="body2">{user.usageStats.gemini.imagesGenerated}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Money Consumed:</Typography>
                                    <Typography variant="body2">
                                        ${user.usageStats.gemini.moneyConsumed.toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Claude 3 Haiku Usage
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Input Tokens:</Typography>
                                    <Typography variant="body2">{user.usageStats.claude.inputTokens}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Output Tokens:</Typography>
                                    <Typography variant="body2">{user.usageStats.claude.outputTokens}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Money Consumed:</Typography>
                                    <Typography variant="body2">
                                        ${user.usageStats.claude.moneyConsumed.toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MyAccountPage;
