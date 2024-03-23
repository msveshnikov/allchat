import { createTheme } from "@mui/material/styles";

const theme = (mode) =>
    createTheme({
        typography: {
            fontFamily: "PT Sans, sans-serif",
        },
        components: {
            MuiSnackbarContent: {
                styleOverrides: {
                    root: {
                        fontFamily: "PT Sans, sans-serif",
                        fontSize: "1rem",
                        backgroundColor: "#333333",
                        color: "#ffffff",
                        padding: "16px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    },
                    message: {
                        padding: 0,
                    },
                },
            },
        },
    });

export default theme;
