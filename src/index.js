import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Main from "./components/Main";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Admin from "./components/Admin";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import PasswordReset from "./components/PasswordReset";
import CustomGPTPage from "./components/CustomGPT";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";

const root = ReactDOM.createRoot(document.getElementById("root"));

const type = "light";
const element = document.body;
if (type === "dark") {
    element.classList.add("dark-mode");
} else {
    element.classList.remove("dark-mode");
}

root.render(
    <ThemeProvider theme={theme(type)}>
        <I18nextProvider>
            <Router>
                <Routes>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/custom" element={<CustomGPTPage />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </Router>
        </I18nextProvider>
    </ThemeProvider>
);

serviceWorkerRegistration.register();
