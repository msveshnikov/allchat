import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Main from "./components/Main";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import StatsPage from "./components/StatsPage";
import "./i18n"; // Import the i18n configuration
import { I18nextProvider } from "react-i18next";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme("light")}>
        <I18nextProvider>
            <Router>
                <Routes>
                    <Route path="/admin" element={<StatsPage />} />
                    <Route path="/" element={<Main />} />
                </Routes>
            </Router>
        </I18nextProvider>
    </ThemeProvider>
);

serviceWorkerRegistration.register();
