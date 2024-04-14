import React from "react";
import { render, screen } from "@testing-library/react";
import Settings from "../Settings";
import "@testing-library/jest-dom";

const mockUser = {
    email: "test@example.com",
    usageStats: {
        gemini: {
            inputCharacters: 1001,
            outputCharacters: 2000,
            imagesGenerated: 11,
            moneyConsumed: 5.99,
        },
        claude: {
            inputTokens: 500,
            outputTokens: 1000,
            moneyConsumed: 2.99,
        },
    },
};

describe("Settings", () => {
    it("renders the user email", () => {
        render(<Settings user={mockUser} />);
        const emailElement = screen.getByText(/test@example.com/i);
        expect(emailElement).toBeInTheDocument();
    });

    it("renders the Gemini Pro 1.5 usage stats", () => {
        render(<Settings user={mockUser} />);
        const inputCharactersElement = screen.getByText(/1001/i);
        const outputCharactersElement = screen.getByText(/2000/i);
        const imagesGeneratedElement = screen.getByText(/11/i);
        const moneyConsumedElement = screen.getByText(/\$5.99/i);
        expect(inputCharactersElement).toBeInTheDocument();
        expect(outputCharactersElement).toBeInTheDocument();
        expect(imagesGeneratedElement).toBeInTheDocument();
        expect(moneyConsumedElement).toBeInTheDocument();
    });

    it("renders the Claude 3 Haiku usage stats", () => {
        render(<Settings user={mockUser} />);
        const inputTokensElement = screen.getByText(/500/i);
        const outputTokensElement = screen.getByText(/1000/i);
        const moneyConsumedElement = screen.getByText(/\$2.99/i);
        expect(inputTokensElement).toBeInTheDocument();
        expect(outputTokensElement).toBeInTheDocument();
        expect(moneyConsumedElement).toBeInTheDocument();
    });
});
