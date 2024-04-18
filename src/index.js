import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Main from "./components/Main";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import StatsPage from "./components/StatsPage";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import PasswordReset from "./components/PasswordReset";
import CustomGPTPage from "./components/CustomGPTPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme("light")}>
        <I18nextProvider>
            <Router>
                <Routes>
                    <Route path="/admin" element={<StatsPage />} />
                    <Route path="/custom" element={<CustomGPTPage />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </Router>
        </I18nextProvider>
    </ThemeProvider>
);

serviceWorkerRegistration.register();
