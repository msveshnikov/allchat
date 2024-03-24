import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "../../App";
import "@testing-library/jest-dom/extend-expect";

describe("App Component", () => {
    it("renders without crashing", () => {
        render(<App />);
    });

    it("opens authentication modal when authentication button is clicked", async () => {
        const { getByText, getByRole } = render(<App />);
        const authButton = getByText("Sign In");

        fireEvent.click(authButton);

        await waitFor(() => {
            expect(getByRole("heading", "Login")).toBeInTheDocument();
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
        const { getByText } = render(<App />);
        const inputField = screen.getByLabelText("Enter your question");
        const submitButton = getByText("Send");

        fireEvent.change(inputField, { target: { value: "Test message" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(inputField.value).toBe("");
        });
    });

});
