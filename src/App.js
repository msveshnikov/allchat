import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { I18nextProvider } from "react-i18next";
import Main from "./components/Main";
import Admin from "./components/Admin";
import PasswordReset from "./components/PasswordReset";
import CustomGPTPage from "./components/CustomGPT";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import ReactGA from "react-ga4";

ReactGA.initialize("G-L4KLPWXQ75");

const App = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const element = document.body;
    if (darkMode) {
        element.classList.add("dark-mode");
    } else {
        element.classList.remove("dark-mode");
    }

    return (
        <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
            <I18nextProvider>
                <Router>
                    <Routes>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/custom" element={<CustomGPTPage />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/" element={<Main darkMode={darkMode} toggleTheme={toggleTheme} />} />
                        <Route path="/reset-password/:token" element={<PasswordReset />} />
                    </Routes>
                </Router>
            </I18nextProvider>
        </ThemeProvider>
    );
};

export default App;
