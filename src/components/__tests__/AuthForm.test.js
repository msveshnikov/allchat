import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AuthForm from "../AuthForm";
import "@testing-library/jest-dom/extend-expect";

describe("AuthForm", () => {
    const onAuthenticationMock = jest.fn();

    beforeEach(() => {
        onAuthenticationMock.mockClear();
    });

    test("renders login form by default", () => {
        render(<AuthForm onAuthentication={onAuthenticationMock} />);
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("toggles between login and register forms", () => {
        render(<AuthForm onAuthentication={onAuthenticationMock} />);

        // Check initial state (login form)
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.queryByText("Register")).toBeNull();

        // Toggle to register form
        fireEvent.click(screen.getByText("Don't have an account? Register"));
        expect(screen.getByText("Register")).toBeInTheDocument();
        expect(screen.queryByText("Login")).toBeNull();
    });

    test("displays error message for invalid email", async () => {
        render(<AuthForm onAuthentication={onAuthenticationMock} />);

        // Enter invalid email and submit the form
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid-email" } });
        fireEvent.click(screen.getByText("Login"));

        // Check if the error message is displayed
        await waitFor(() => expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument());
    });

    test("calls onAuthentication with token and email on successful login", async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ token: "mock-token" }) };
        global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

        render(<AuthForm onAuthentication={onAuthenticationMock} />);

        // Enter valid credentials and submit the form
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "valid@email.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
        fireEvent.click(screen.getByText("Login"));

        // Check if onAuthentication is called with the correct arguments
        await waitFor(() => expect(onAuthenticationMock).toHaveBeenCalledWith("mock-token", "valid@email.com"));
    });

    // Add more tests for other scenarios, such as successful registration, error handling, etc.
});
