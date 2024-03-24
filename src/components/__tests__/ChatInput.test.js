import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import ChatInput from "../ChatInput";
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event";

describe("ChatInput", () => {
    const mockSetInput = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnFileSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders input field", () => {
        render(<ChatInput input="" setInput={mockSetInput} onSubmit={mockOnSubmit} onFileSelect={mockOnFileSelect} />);
        const inputField = screen.getByLabelText("Enter your question");
        expect(inputField).toBeInTheDocument();
    });

    test("updates input value on change", () => {
        render(<ChatInput input="" setInput={mockSetInput} onSubmit={mockOnSubmit} onFileSelect={mockOnFileSelect} />);
        const inputField = screen.getByLabelText("Enter your question");
        fireEvent.change(inputField, { target: { value: "Hello, world!" } });
        expect(mockSetInput).toHaveBeenCalledWith("Hello, world!");
    });

    test("calls onSubmit when Enter key is pressed", async () => {
        const mockSetInput = jest.fn();
        const mockOnSubmit = jest.fn();
        const mockOnFileSelect = jest.fn();

        render(
            <ChatInput
                input="Test input"
                setInput={mockSetInput}
                onSubmit={mockOnSubmit}
                onFileSelect={mockOnFileSelect}
                selectedFile={null}
            />
        );

        const inputField = screen.getByLabelText("Enter your question");
        await act(async () => {
            await userEvent.type(inputField, "Test input{enter}");
        });

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
