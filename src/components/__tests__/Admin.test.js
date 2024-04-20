import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import Admin from "../Admin";
import "@testing-library/jest-dom";

jest.mock("../Main", () => ({
    API_URL: "https://api.example.com",
}));

describe("StatsPage", () => {
    const mockStats = {
        gemini: {
            totalImagesGenerated: 10,
            totalMoneyConsumed: 5.99,
        },
        claude: {
            totalInputTokens: 500,
            totalOutputTokens: 1000,
            totalMoneyConsumed: 3.99,
        },
    };

    beforeEach(() => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockStats),
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders stats after data is fetched", async () => {
        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText("Admin Statistics")).toBeInTheDocument();
            expect(screen.getByText("Gemini Pro 1.5 Usage")).toBeInTheDocument();
            expect(
                screen.getByText(`Total Images Generated: ${mockStats.gemini.totalImagesGenerated}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Total Money Consumed: $${mockStats.gemini.totalMoneyConsumed.toFixed(2)}`)
            ).toBeInTheDocument();
            expect(screen.getByText("Claude 3 Haiku Usage")).toBeInTheDocument();
            expect(screen.getByText(`Total Input Tokens: ${mockStats.claude.totalInputTokens}`)).toBeInTheDocument();
            expect(screen.getByText(`Total Output Tokens: ${mockStats.claude.totalOutputTokens}`)).toBeInTheDocument();
            expect(
                screen.getByText(`Total Money Consumed: $${mockStats.claude.totalMoneyConsumed.toFixed(2)}`)
            ).toBeInTheDocument();
        });
    });
});
