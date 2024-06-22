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
import { GoogleOAuthProvider } from "@react-oauth/google";
import AvatarBuilder from "./components/AvatarBuilder";
import Artifact from "./components/Artifact";

ReactGA.initialize("G-L4KLPWXQ75");

const App = () => {
    const [themeMode, setThemeMode] = useState(localStorage.getItem("themeMode") || "light");

    useEffect(() => {
        localStorage.setItem("themeMode", themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode((prevMode) => {
            if (prevMode === "light") return "dark";
            if (prevMode === "dark") return "third";
            return "light";
        });
    };

    const element = document.body;
    element.classList.remove("light-mode", "dark-mode", "third-mode");
    element.classList.add(`${themeMode}-mode`);

    return (
        <ThemeProvider theme={theme(themeMode)}>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <I18nextProvider>
                    <Router>
                        <Routes>
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/custom" element={<CustomGPTPage />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/avatar" element={<AvatarBuilder />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route
                                path="/chat/:chatId"
                                element={<Main themeMode={themeMode} toggleTheme={toggleTheme} />}
                            />
                            <Route path="/reset-password/:token" element={<PasswordReset />} />
                            <Route path="/" element={<Main themeMode={themeMode} toggleTheme={toggleTheme} />} />
                            <Route path="/artifact" element={<Artifact />} />
                        </Routes>
                    </Router>
                </I18nextProvider>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
};

export default App;
