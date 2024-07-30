import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = (mode) =>
    createTheme({
        palette:
            mode === "light"
                ? {
                      // Light theme (unchanged)
                      mode: "light",
                      primary: {
                          main: "#1976D2",
                      },
                      secondary: {
                          main: "#f55077",
                      },
                      background: {
                          default: "#f5f5f5",
                          paper: "#ffffff",
                      },
                      text: {
                          primary: "#333333",
                          secondary: "#666666",
                      },
                      modelName: "#c5c5c5", 
                      chatBubble: {
                          userBg: "#d4edda",
                          userColor: "#155724",
                          assistantBg: "#cff4fc",
                          assistantColor: "#0c5460",
                          errorBg: "#f8d7da",
                          errorColor: "#721c24",
                          editBg: "#f5f5a5",
                      },
                  }
                : mode === "dark"
                ? {
                      // Dark theme (unchanged)
                      mode: "dark",
                      primary: {
                          main: "#F50057",
                      },
                      secondary: {
                          main: "#673ab7",
                      },
                      background: {
                          default: "#1e1e1e",
                          paper: "#262626",
                      },
                      text: {
                          primary: "#ffffff",
                          secondary: "#cccccc",
                      },
                      error: {
                          main: red.A400,
                      },
                      modelName: "#c5c5c5", 
                      chatBubble: {
                          userBg: "#333333",
                          userColor: "#cccccc",
                          assistantBg: "#0e3b45",
                          assistantColor: "#cff4fc",
                          errorBg: "#4d1a1e",
                          errorColor: "#f8d7da",
                          editBg: "#484848",
                      },
                  }
                : {
                      // Third theme (Sunset theme with increased contrast)
                      mode: "light",
                      primary: {
                          main: "#FF6B6B",
                      },
                      secondary: {
                          main: "#4ECDC4",
                      },
                      background: {
                          default: "#FFF3E0",
                          paper: "#FFFFFF",
                      },
                      text: {
                          primary: "#2C3E50",
                          secondary: "#34495E",
                      },
                      modelName: "#2C3E50", // Dark blue-grey for third theme
                      chatBubble: {
                          userBg: "#FFD3B6",
                          userColor: "#B7400E", // Darkened for better contrast
                          assistantBg: "#A8E6CF",
                          assistantColor: "#00574B", // Darkened for better contrast
                          errorBg: "#FFAAA5",
                          errorColor: "#9B2C23", // Slightly darkened for consistency
                          editBg: "#DCEDC1",
                      },
                  },
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
