import React from "react";
import { Dialog, Button, Box, Typography } from "@mui/material";

export function ConfirmModal({ show, onConfirm, setShow, title, text }) {
    return (
        <Dialog
            open={show}
            style={{
                border: "1px solid #ccc",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: "8px",
                padding: "24px",
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" p={4} m={2}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {text}
                </Typography>
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={onConfirm} style={{ marginRight: "8px" }}>
                        Yes
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => setShow(false)}>
                        No
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
