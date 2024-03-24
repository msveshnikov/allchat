import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ChatInput from "../ChatInput";
import "@testing-library/jest-dom/extend-expect";

describe("ChatInput", () => {
    const mockSetInput = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnFileSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders input field", () => {
        render(<ChatInput input="" setInput={mockSetInput} onSubmit={mockOnSubmit} onFileSelect={mockOnFileSelect} />);
        const inputField = screen.getByTestId("input-field");
        expect(inputField).toBeInTheDocument();
    });

    test("updates input value on change", () => {
        render(<ChatInput input="" setInput={mockSetInput} onSubmit={mockOnSubmit} onFileSelect={mockOnFileSelect} />);
        const inputField = screen.getByTestId("input-field");
        fireEvent.change(inputField, { target: { value: "Hello, world!" } });
        expect(mockSetInput).toHaveBeenCalledWith("Hello, world!");
    });

    test("calls onSubmit when Enter key is pressed", () => {
        render(
            <ChatInput
                input="Test input"
                setInput={mockSetInput}
                onSubmit={mockOnSubmit}
                onFileSelect={mockOnFileSelect}
            />
        );
        const inputField = screen.getByTestId("input-field");
        fireEvent.keyPress(inputField, { key: "Enter", code: "Enter" });
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    test("calls onSubmit when Send button is clicked", () => {
        render(
            <ChatInput
                input="Test input"
                setInput={mockSetInput}
                onSubmit={mockOnSubmit}
                onFileSelect={mockOnFileSelect}
            />
        );
        const sendButton = screen.getByRole("button", { name: "Send" });
        fireEvent.click(sendButton);
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    test("renders FileSelector component", () => {
        render(
            <ChatInput
                input=""
                setInput={mockSetInput}
                onSubmit={mockOnSubmit}
                onFileSelect={mockOnFileSelect}
                selectedFile={null}
            />
        );
        const fileSelectorComponent = screen.getByTestId("file-input");
        expect(fileSelectorComponent).toBeInTheDocument();
    });
});
