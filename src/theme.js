import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = (mode) =>
    createTheme({
        palette:
            mode !== "dark"
                ? {
                      mode: mode,
                      primary: {
                          main: "#1976D2",
                      },
                      secondary: {
                          main: "#f55077",
                      },
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
                : {
                      mode: mode,
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
                      chatBubble: {
                          userBg: "#333333",
                          userColor: "#cccccc",
                          assistantBg: "#0e3b45",
                          assistantColor: "#cff4fc",
                          errorBg: "#4d1a1e",
                          errorColor: "#f8d7da",
                          editBg: "#484848",
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
