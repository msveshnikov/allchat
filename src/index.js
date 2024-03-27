import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import AdminStatsPage from "./components/AdminStatspage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme("light")}>
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/admin" element={<AdminStatsPage />} />
                    <Route path="/" element={<App />} />
                </Routes>
            </Router>
        </React.StrictMode>
    </ThemeProvider>
);

serviceWorkerRegistration.register();
