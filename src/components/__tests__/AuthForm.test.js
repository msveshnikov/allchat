import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../AuthForm";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../App", () => ({
    API_URL: "http://example.com/api",
}));

describe("AuthForm Component", () => {
    it("renders without crashing", () => {
        render(<AuthForm />);
    });

    it("handles form submission correctly", async () => {
        const mockOnAuthentication = jest.fn();
        const { getByLabelText, getByRole } = render(<AuthForm onAuthentication={mockOnAuthentication} />);

        // Mock the successful fetch response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: "mock_token" }),
        });

        const emailInput = getByLabelText("Email");
        const passwordInput = getByLabelText("Password");
        const submitButton = getByRole("button", { name: "Login" });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnAuthentication).toHaveBeenCalledTimes(1);
            expect(mockOnAuthentication).toHaveBeenCalledWith("mock_token", "test@example.com");
        });
    });

    it("handles toggle mode correctly", () => {
        const { getByRole } = render(<AuthForm />);
        const toggleButton = getByRole("button", { name: /Don't have an account\? Register/i });
        fireEvent.click(toggleButton);
        const registerHeading = getByRole("heading", { name: "Register" });
        expect(registerHeading).toBeInTheDocument();
    });

    it("displays error message for invalid email", async () => {
        const { getByLabelText, getByRole, getAllByText } = render(<AuthForm />);
        const emailInput = getByLabelText("Email");
        const submitButton = getByRole("button", { name: "Login" });

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.click(submitButton);

        expect(getAllByText("Please enter a valid email address.")[0]).toBeInTheDocument();
    });
});
