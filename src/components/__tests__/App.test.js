import React from "react";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react";
import App from "../../App";
import "@testing-library/jest-dom/extend-expect";

global.fetch = jest.fn();

describe("App Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("renders without crashing", () => {
        render(<App />);
    });

    it("should generate chat summary when selecting a history item", async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ textResponse: "Test summary" }) };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        // Add some chat history
        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Hello" } });
        fireEvent.click(submitButton);

        fireEvent.change(inputField, { target: { value: "How are you?" } });
        fireEvent.click(submitButton);

        // Open the SideDrawer
        const drawerToggleButton = screen.getByRole("button", { name: "open drawer" });
        fireEvent.click(drawerToggleButton);

        // Select the first history item
        const historyItem = await screen.findByText(/Hello/i);
        fireEvent.click(historyItem);

        // Check if the chat summary is generated correctly
        const chatSummary = await screen.findByText("Test summary");
        expect(chatSummary).toBeInTheDocument();
    });

    it("should send file and query to API", async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ textResponse: "Test response" }) };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Test query" } });

        // Wrap the state update with act
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        const fetchOptions = global.fetch.mock.calls[0][1];
        expect(fetchOptions.method).toBe("POST");
        expect(fetchOptions.headers).toHaveProperty("Authorization");
        expect(JSON.parse(fetchOptions.body)).toHaveProperty("input", "Test query");
    });

    it("should handle failed API response", async () => {
        const mockResponse = { ok: false, status: 500 };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Test query" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText("Failed response from the server.")).toBeInTheDocument());
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

    it("should handle authentication failure on API response", async () => {
        const mockResponse = { ok: false, status: 403 };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Test query" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(screen.getByText("Authentication failed.")).toBeInTheDocument());
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("userEmail")).toBeNull();
    });

    it("should handle failed API response with different error", async () => {
        const mockResponse = { ok: false, status: 500 };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Test query" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(screen.getAllByText("Failed response from the server.")[0]).toBeInTheDocument());
    });

    it("should handle failed API response without error message", async () => {
        const mockResponse = { ok: false, status: 500, json: () => Promise.resolve({}) };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Test query" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(screen.getAllByText("Failed response from the server.")[0]).toBeInTheDocument());
    });

    it("should handle network error when sending API request", async () => {
        global.fetch.mockRejectedValueOnce(new Error("Network error"));

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        fireEvent.change(inputField, { target: { value: "Test query" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(screen.getByText("Failed to connect to the server.")).toBeInTheDocument());
    });

    it("should clear all chat history", async () => {
        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        // Add some chat history
        fireEvent.change(inputField, { target: { value: "Hello" } });
        fireEvent.click(submitButton);

        fireEvent.change(inputField, { target: { value: "How are you?" } });
        fireEvent.click(submitButton);

        // Open the SideDrawer
        const drawerToggleButton = screen.getByRole("button", { name: "open drawer" });
        fireEvent.click(drawerToggleButton);

        // Clear all chat history
        const clearHistoryButton = screen.getByRole("button", { name: "Clear All" });
        fireEvent.click(clearHistoryButton);

        expect(localStorage.getItem("chatHistory")).toBeNull();
        expect(localStorage.getItem("storedChatHistories")).toBeNull();
        expect(screen.queryByText("Hello")).not.toBeInTheDocument();
        expect(screen.queryByText("How are you?")).not.toBeInTheDocument();
    });

    it("should handle new chat", async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ textResponse: "Test summary" }) };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        // Add some chat history
        fireEvent.change(inputField, { target: { value: "Hello" } });
        fireEvent.click(submitButton);

        // Open the SideDrawer
        const drawerToggleButton = screen.getByRole("button", { name: "open drawer" });
        fireEvent.click(drawerToggleButton);

        // Start a new chat
        const newChatButton = screen.getByRole("button", { name: "New Chat" });
        fireEvent.click(newChatButton);

        expect(localStorage.getItem("chatHistory")).toBeNull();
        expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    });

    it("should handle history selection", async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ textResponse: "Test summary" }) };
        global.fetch.mockResolvedValueOnce(mockResponse);

        render(<App />);

        const inputField = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button", { name: "Send" });

        // Add some chat history
        fireEvent.change(inputField, { target: { value: "Hello" } });
        fireEvent.click(submitButton);

        fireEvent.change(inputField, { target: { value: "How are you?" } });
        fireEvent.click(submitButton);

        // Open the SideDrawer
        let drawerToggleButton = screen.getByRole("button", { name: "open drawer" });
        fireEvent.click(drawerToggleButton);

        // Start a new chat
        const newChatButton = screen.getByRole("button", { name: "New Chat" });
        fireEvent.click(newChatButton);

        // Open the SideDrawer
        drawerToggleButton = screen.getByRole("button", { name: "open drawer" });
        fireEvent.click(drawerToggleButton);

        // Select the first history item
        const historyItem = (await screen.findAllByRole("button", "Test summary"))[0];
        fireEvent.click(historyItem);

        await waitFor(() => expect(screen.getAllByText("Hello")[0]).toBeInTheDocument());
        expect(screen.getAllByText("How are you?")[0]).toBeInTheDocument();
    });
});
