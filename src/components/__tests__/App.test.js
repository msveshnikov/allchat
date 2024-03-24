import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "../../App";

describe("App Component", () => {
    it("renders without crashing", () => {
        render(<App />);
    });

    it("opens authentication modal when authentication button is clicked", async () => {
        const { getByTestId, getByText } = render(<App />);
        const authButton = getByTestId("auth-button");

        fireEvent.click(authButton);

        await waitFor(() => {
            expect(getByText("Authentication Form")).toBeInTheDocument();
        });
    });

    it("handles file selection correctly", async () => {
        const { getByTestId } = render(<App />);
        const fileInput = getByTestId("file-input");

        const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(fileInput.files[0]).toEqual(file);
        });
    });

    it("submits input correctly", async () => {
        const { getByTestId, getByText } = render(<App />);
        const inputField = screen.getByLabelText("Enter your question");
        const submitButton = getByText("Send");

        fireEvent.change(inputField, { target: { value: "Test message" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(inputField.value).toBe("");
        });
    });

    // Add more tests as needed...
});
