import { createTheme } from "@mui/material/styles";

const theme = (mode) =>
    createTheme({
        typography: {
            fontFamily: "PT Sans, sans-serif",
        },
    });

export default theme;
