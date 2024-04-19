import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CustomGPTPage from "../CustomGPTPage";
import "@testing-library/jest-dom";

describe("CustomGPTPage", () => {
    beforeEach(() => {
        render(<CustomGPTPage />);
    });

    it("renders the page title", () => {
        const title = screen.getByText("Custom GPT");
        expect(title).toBeInTheDocument();
    });

    it("updates the name input field", () => {
        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "Test Name" } });
        expect(nameInput.value).toBe("Test Name");
    });

    it("updates the instructions text area", () => {
        const instructionsTextArea = screen.getByLabelText("Instructions");
        fireEvent.change(instructionsTextArea, { target: { value: "Test Instructions" } });
        expect(instructionsTextArea.value).toBe("Test Instructions");
    });

    it("allows file upload", async () => {
        const file = new File(["hello"], "hello.txt", { type: "text/plain" });
        const fileUploadInput = screen.getByTestId("file-upload-input");
        fireEvent.change(fileUploadInput, { target: { files: [file] } });
        expect(screen.getByText("hello.txt")).toBeInTheDocument();
    });

    it("handles file drop", async () => {
        const file = new File(["hello"], "hello.txt", { type: "text/plain" });
        const dropArea = screen.getByText("Drag and drop files here or click to upload");
        fireEvent.drop(dropArea, { dataTransfer: { files: [file] } });
        expect(screen.getByText("hello.txt")).toBeInTheDocument();
    });

    it("handles form submission", async () => {
        // Mock the successful fetch response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ message: "Success", currentSize: 1000 }),
        });

        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "Test Name" } });

        const instructionsTextArea = screen.getByLabelText("Instructions");
        fireEvent.change(instructionsTextArea, { target: { value: "Test Instructions" } });

        const file = new File(["hello"], "hello.txt", { type: "text/plain" });
        const fileInput = screen.getByTestId("file-upload-input");
        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton); 

        await waitFor(() => {
            expect(screen.getByText("Success")).toBeInTheDocument();
            expect(screen.getByText("Current Size: 1000 bytes (60,000 max)")).toBeInTheDocument();
        });
    });
});
