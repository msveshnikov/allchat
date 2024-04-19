import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PasswordReset from "../PasswordReset";
import "@testing-library/jest-dom";

describe("PasswordReset", () => {
    test("renders password reset form", () => {
        render(
            <MemoryRouter initialEntries={["/reset-password/token"]}>
                <Routes>
                    <Route path="/reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Reset Password" })).toBeInTheDocument();
    });

    test("shows error when passwords do not match", async () => {
        render(
            <MemoryRouter initialEntries={["/reset-password/token"]}>
                <Routes>
                    <Route path="/reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </MemoryRouter>
        );

        const newPasswordInput = screen.getByLabelText("New Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
        const resetButton = screen.getByRole("button", { name: "Reset Password" });

        fireEvent.change(newPasswordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password456" } });
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
        });
    });

    test("shows success message after password reset", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );

        render(
            <MemoryRouter initialEntries={["/reset-password/token"]}>
                <Routes>
                    <Route path="/reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </MemoryRouter>
        );

        const newPasswordInput = screen.getByLabelText("New Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
        const resetButton = screen.getByRole("button", { name: "Reset Password" });

        fireEvent.change(newPasswordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(screen.getByText("Password reset successful")).toBeInTheDocument();
        });
    });
});
