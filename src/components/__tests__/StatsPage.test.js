import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import StatsPage from "../StatsPage";
import "@testing-library/jest-dom";

jest.mock("../../App", () => ({
    API_URL: "https://api.example.com",
}));

describe("StatsPage", () => {
    const mockStats = {
        gemini: {
            totalInputCharacters: 1000,
            totalOutputCharacters: 2000,
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

    test("renders loading state initially", () => {
        render(<StatsPage />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("renders stats after data is fetched", async () => {
        render(<StatsPage />);

        await waitFor(() => {
            expect(screen.getByText("Admin Statistics")).toBeInTheDocument();
            expect(screen.getByText("Gemini Usage")).toBeInTheDocument();
            expect(
                screen.getByText(`Total Input Characters: ${mockStats.gemini.totalInputCharacters}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Total Output Characters: ${mockStats.gemini.totalOutputCharacters}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Total Images Generated: ${mockStats.gemini.totalImagesGenerated}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Total Money Consumed: $${mockStats.gemini.totalMoneyConsumed.toFixed(2)}`)
            ).toBeInTheDocument();
            expect(screen.getByText("Claude Usage")).toBeInTheDocument();
            expect(screen.getByText(`Total Input Tokens: ${mockStats.claude.totalInputTokens}`)).toBeInTheDocument();
            expect(screen.getByText(`Total Output Tokens: ${mockStats.claude.totalOutputTokens}`)).toBeInTheDocument();
            expect(
                screen.getByText(`Total Money Consumed: $${mockStats.claude.totalMoneyConsumed.toFixed(2)}`)
            ).toBeInTheDocument();
        });
    });
});
