import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);

serviceWorkerRegistration.register();
