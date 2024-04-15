import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { API_URL } from "./Main";

const PasswordReset = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { t } = useTranslation();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t("Passwords do not match"));
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setError("");
            } else {
                setError(data.error);
                setSuccess(false);
            }
        } catch (error) {
            setError(t("An error occurred"));
            setSuccess(false);
        }
    };

    return (
        <div>
            <h2>{t("Password Reset")}</h2>
            {error && <p>{error}</p>}
            {success && <p>{t("Password reset successful")}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder={t("New Password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder={t("Confirm New Password")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">{t("Reset Password")}</button>
            </form>
        </div>
    );
};

export default PasswordReset;
