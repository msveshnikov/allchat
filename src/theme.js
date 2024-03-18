import { createTheme } from "@mui/material/styles";

const theme = (mode) =>
    createTheme({
        palette: {
            mode: mode,
            primary: {
                main: "#F50057",
            },
            secondary: {
                main: "#673ab7",
            },
        },
        typography: {
            fontFamily: ["cursive"].join(","),
        },
    });

export default theme;
