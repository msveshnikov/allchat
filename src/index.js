import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Main from "./components/Main";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import StatsPage from "./components/StatsPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme("light")}>
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/admin" element={<StatsPage />} />
                    <Route path="/" element={<Main />} />
                </Routes>
            </Router>
        </React.StrictMode>
    </ThemeProvider>
);

serviceWorkerRegistration.register();
