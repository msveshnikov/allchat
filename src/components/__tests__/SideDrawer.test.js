import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SideDrawer from "../SideDrawer";

describe("SideDrawer Component", () => {
    const mockOnToggle = jest.fn();
    const mockOnNewChat = jest.fn();
    const mockOnHistorySelection = jest.fn();
    const mockOnModelChange = jest.fn();
    const mockOnClearAll = jest.fn();

    const storedChatHistories = [
        { summary: "Chat History 1" },
        { summary: "Chat History 2" },
        { summary: "Chat History 3" },
    ];

    it("renders without crashing", () => {
        render(
            <SideDrawer
                isOpen={true}
                onToggle={mockOnToggle}
                onNewChat={mockOnNewChat}
                storedChatHistories={storedChatHistories}
                onHistorySelection={mockOnHistorySelection}
                model="gemini"
                onModelChange={mockOnModelChange}
                onClearAll={mockOnClearAll}
            />
        );
    });

    it("calls onNewChat when 'New Chat' item is clicked", () => {
        const { getByText } = render(
            <SideDrawer
                isOpen={true}
                onToggle={mockOnToggle}
                onNewChat={mockOnNewChat}
                storedChatHistories={storedChatHistories}
                onHistorySelection={mockOnHistorySelection}
                model="gemini"
                onModelChange={mockOnModelChange}
                onClearAll={mockOnClearAll}
            />
        );
        fireEvent.click(getByText("New Chat"));
        expect(mockOnNewChat).toHaveBeenCalled();
    });

    it("calls onHistorySelection with correct index when a chat history item is clicked", () => {
        const { getByText } = render(
            <SideDrawer
                isOpen={true}
                onToggle={mockOnToggle}
                onNewChat={mockOnNewChat}
                storedChatHistories={storedChatHistories}
                onHistorySelection={mockOnHistorySelection}
                model="gemini"
                onModelChange={mockOnModelChange}
                onClearAll={mockOnClearAll}
            />
        );
        fireEvent.click(getByText("Chat History 2"));
        expect(mockOnHistorySelection).toHaveBeenCalledWith(1);
    });

    // it("calls onModelChange when ModelSwitch is toggled", () => {
    //     const { getByLabelText } = render(
    //         <SideDrawer
    //             isOpen={true}
    //             onToggle={mockOnToggle}
    //             onNewChat={mockOnNewChat}
    //             storedChatHistories={storedChatHistories}
    //             onHistorySelection={mockOnHistorySelection}
    //             model="gemini"
    //             onModelChange={mockOnModelChange}
    //             onClearAll={mockOnClearAll}
    //         />
    //     );
    //     fireEvent.click(getByLabelText("Claude Haiku"));
    //     expect(mockOnModelChange).toHaveBeenCalledWith("claude");
    // });

    it("calls onClearAll when 'Clear All' item is clicked", () => {
        const { getByText } = render(
            <SideDrawer
                isOpen={true}
                onToggle={mockOnToggle}
                onNewChat={mockOnNewChat}
                storedChatHistories={storedChatHistories}
                onHistorySelection={mockOnHistorySelection}
                model="gemini"
                onModelChange={mockOnModelChange}
                onClearAll={mockOnClearAll}
            />
        );
        fireEvent.click(getByText("Clear All"));
        expect(mockOnClearAll).toHaveBeenCalled();
    });
});
