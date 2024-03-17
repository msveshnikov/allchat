import { red } from "@mui/material/colors";
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
            error: {
                main: red.A400,
            },
        },
    });

export default theme;
