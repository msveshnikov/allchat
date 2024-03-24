import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../AuthForm";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../App", () => ({
    API_URL: "http://example.com/api",
}));

describe("AuthForm Component", () => {
    it("renders without crashing", () => {
        render(<AuthForm />);
    });

    it("should register a new user", async () => {
        const onAuthentication = jest.fn();
        render(<AuthForm onAuthentication={onAuthentication} />);

        // Mock the successful fetch response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: "mock_token" }),
        });

        // Switch to registration mode
        fireEvent.click(screen.getByText("Don't have an account? Register"));

        // Fill in the registration form
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        // Submit the registration form
        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        // Wait for the registration success message to appear
        await waitFor(() =>
            expect(screen.getByText("Registration successful. Please log in now.")).toBeInTheDocument()
        );

        // Check that the onAuthentication function was not called (registration should not authenticate)
        expect(onAuthentication).not.toHaveBeenCalled();

        // Check that the form was reset
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
    });

    it("should display registration error message", async () => {
        const mockedOnAuthentication = jest.fn();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: "Invalid email or password" }),
            })
        );

        render(<AuthForm onAuthentication={mockedOnAuthentication} />);

        // Switch to registration mode
        fireEvent.click(screen.getByRole("button", { name: /register/i }));

        // Fill in email and password
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "email@rmail.com" },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: "password" },
        });
 
        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /register/i }));

        // Wait for the error message to appear
        await waitFor(() => {
            expect(screen.getAllByText(/invalid email or password/i)[0]).toBeInTheDocument();
        });
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
