import React from "react";
import { render, screen } from "@testing-library/react";
import ChatHistory from "../ChatHistory";
import "@testing-library/jest-dom/extend-expect";

describe("ChatHistory", () => {
    const mockChatHistory = [
        {
            user: "User",
            assistant: "Hello, how can I assist you today?",
            fileType: null,
            userImageData: null,
            error: null,
            image: null,
        },
        {
            user: "User",
            assistant: null,
            fileType: "image/png",
            userImageData: "base64data...",
            error: null,
            image: null,
        },
        { user: "User", assistant: null, fileType: null, userImageData: null, error: "An error occurred", image: null },
        {
            user: "User",
            assistant: "Here is the response with an image",
            fileType: null,
            userImageData: null,
            error: null,
            image: "base64data...",
        },
    ];

    const mockGetFileTypeIcon = jest.fn().mockImplementation((fileType) => {
        if (fileType === "image/png") {
            return "📷";
        }
        return null;
    });

    test("renders chat history", () => {
        render(
            <ChatHistory
                chatHistory={mockChatHistory}
                isModelResponding={false}
                chatContainerRef={null}
                getFileTypeIcon={mockGetFileTypeIcon}
            />
        );
        const chatItems = screen.getAllByTestId("chat-item");
        expect(chatItems).toHaveLength(mockChatHistory.length);
    });

    test("renders user message", () => {
        render(
            <ChatHistory
                chatHistory={mockChatHistory}
                isModelResponding={false}
                chatContainerRef={null}
                getFileTypeIcon={mockGetFileTypeIcon}
            />
        );
        const userMessages = screen.getAllByText("User");
        expect(userMessages).toHaveLength(mockChatHistory.length);
    });

    test("renders assistant message", () => {
        render(
            <ChatHistory
                chatHistory={mockChatHistory}
                isModelResponding={false}
                chatContainerRef={null}
                getFileTypeIcon={mockGetFileTypeIcon}
            />
        );
        const assistantMessage = screen.getByText("Hello, how can I assist you today?");
        expect(assistantMessage).toBeInTheDocument();
    });

    test("renders error message", () => {
        render(
            <ChatHistory
                chatHistory={mockChatHistory}
                isModelResponding={false}
                chatContainerRef={null}
                getFileTypeIcon={mockGetFileTypeIcon}
            />
        );
        const errorMessage = screen.getByText("An error occurred");
        expect(errorMessage).toBeInTheDocument();
    });

    test("renders user image data", () => {
        render(
            <ChatHistory
                chatHistory={mockChatHistory}
                isModelResponding={false}
                chatContainerRef={null}
                getFileTypeIcon={mockGetFileTypeIcon}
            />
        );
        const userImageData = screen.getByAltText("User input");
        expect(userImageData).toBeInTheDocument();
    });

    test("renders model output image", () => {
        render(
            <ChatHistory
                chatHistory={mockChatHistory}
                isModelResponding={false}
                chatContainerRef={null}
                getFileTypeIcon={mockGetFileTypeIcon}
            />
        );
        const modelOutputImage = screen.getByAltText("Model output");
        expect(modelOutputImage).toBeInTheDocument();
    });

    // test("renders file type icon", () => {
    //     render(
    //         <ChatHistory
    //             chatHistory={mockChatHistory}
    //             isModelResponding={false}
    //             chatContainerRef={null}
    //             getFileTypeIcon={mockGetFileTypeIcon}
    //         />
    //     );
    //     const fileTypeIcon = screen.getByText("📷");
    //     expect(fileTypeIcon).toBeInTheDocument();
    // });

    // test("renders loading spinner when model is responding", () => {
    //     render(
    //         <ChatHistory
    //             chatHistory={mockChatHistory}
    //             isModelResponding={true}
    //             chatContainerRef={null}
    //             getFileTypeIcon={mockGetFileTypeIcon}
    //         />
    //     );
    //     const loadingSpinner = screen.getByRole("progressbar");
    //     expect(loadingSpinner).toBeInTheDocument();
    // });
});
