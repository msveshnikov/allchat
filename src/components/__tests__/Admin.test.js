import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Admin from "../Admin";
import "@testing-library/jest-dom";
import { API_URL } from "../Main";

jest.mock("../Main", () => ({ API_URL: "https://api.example.com" }));

describe("Admin", () => {
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

    const mockGpts = [
        {
            _id: "1",
            name: "GPT 1",
            instructions: "This is a test GPT",
            knowledge: "Some knowledge about the GPT",
        },
        {
            _id: "2",
            name: "GPT 2",
            instructions: "Another test GPT",
            knowledge: "More knowledge about the GPT",
        },
    ];

    beforeEach(() => {
        jest.spyOn(global, "fetch").mockImplementation((url) => {
            if (url === `${API_URL}/stats`) {
                return Promise.resolve({
                    ok: true,
                    json: jest.fn().mockResolvedValue(mockStats),
                });
            } else if (url === `${API_URL}/customgpt-details`) {
                return Promise.resolve({
                    ok: true,
                    json: jest.fn().mockResolvedValue(mockGpts),
                });
            }
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders stats after data is fetched", async () => {
        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText("Admin Statistics")).toBeInTheDocument();
            expect(screen.getByText("Gemini Pro Usage")).toBeInTheDocument();
            expect(screen.getByText(`${mockStats.gemini.totalImagesGenerated}`)).toBeInTheDocument();
            expect(screen.getByText(`$${mockStats.gemini.totalMoneyConsumed.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText("Claude 3 Usage")).toBeInTheDocument();
            expect(screen.getByText(`${mockStats.claude.totalInputTokens}`)).toBeInTheDocument();
            expect(screen.getByText(`${mockStats.claude.totalOutputTokens}`)).toBeInTheDocument();
            expect(screen.getByText(`$${mockStats.claude.totalMoneyConsumed.toFixed(2)}`)).toBeInTheDocument();
        });
    });

    test("renders custom GPTs after data is fetched", async () => {
        render(<Admin />);
        await waitFor(() => {
            expect(screen.getByText("Custom GPT Admin")).toBeInTheDocument();
            mockGpts.forEach((gpt) => {
                expect(screen.getByText(gpt.name)).toBeInTheDocument();
                expect(screen.getByText(gpt.instructions)).toBeInTheDocument();
                expect(screen.getByText(gpt.knowledge.slice(0, 1500))).toBeInTheDocument();
            });
        });
    });

    test("deletes a custom GPT when delete button is clicked", async () => {
        render(<Admin />);
        global.fetch = jest.fn().mockImplementation((url, options) => {
            if (options.method === "DELETE") {
                return Promise.resolve({
                    ok: true,
                    json: jest.fn().mockResolvedValue({}),
                });
            }
            return Promise.resolve({ ok: true });
        });

        let deleteButtons;
        await waitFor(() => {
            deleteButtons = screen.getAllByTestId("delete-gpt-button");
            expect(deleteButtons.length).toBe(mockGpts.length);
        });

        fireEvent.click(deleteButtons[0]);

        waitFor(() => {
            expect(screen.queryByText(mockGpts[0].name)).not.toBeInTheDocument();
            expect(screen.queryByText(mockGpts[0].instructions)).not.toBeInTheDocument();
            expect(screen.queryByText(mockGpts[0].knowledge.slice(0, 1500))).not.toBeInTheDocument();
        });
    });
});
