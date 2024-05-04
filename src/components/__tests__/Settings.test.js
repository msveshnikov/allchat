import React from "react";
import { render, screen } from "@testing-library/react";
import Settings from "../Settings";
import "@testing-library/jest-dom";

const mockUser = {
    email: "test@example.com",
};

describe("Settings", () => {
    it("renders the user email", () => {
        render(<Settings user={mockUser} selectedModel="gemini-1.5-pro-preview-0409" />);
        const emailElement = screen.getByText(/test@example.com/i);
        expect(emailElement).toBeInTheDocument();
    });
});
