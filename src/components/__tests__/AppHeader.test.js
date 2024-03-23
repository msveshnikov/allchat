import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AppHeader from "../AppHeader";

describe("AppHeader Component", () => {
    const mockOnToggle = jest.fn();
    const mockOnSignOut = jest.fn();
    const mockOnOpenAuthModal = jest.fn();

    it("renders without crashing", () => {
        render(
            <AppHeader
                isAuthenticated={true}
                userEmail="test@example.com"
                onSignOut={mockOnSignOut}
                onOpenAuthModal={mockOnOpenAuthModal}
                onToggle={mockOnToggle}
            />
        );
    });

    // it("displays user avatar when authenticated", () => {
    //     const { container } = render(
    //         <AppHeader
    //             isAuthenticated={true}
    //             userEmail="test@example.com"
    //             onSignOut={mockOnSignOut}
    //             onOpenAuthModal={mockOnOpenAuthModal}
    //             onToggle={mockOnToggle}
    //         />
    //     );
    //     const avatar = container.querySelector('img[alt="User Avatar"]'); // Find the avatar by querying the container
    //     expect(avatar).toBeInTheDocument();
    // });

    it("calls onSignOut when 'Sign Out' is clicked", () => {
        const { container, getByText } = render(
            <AppHeader
                isAuthenticated={true}
                userEmail="test@example.com"
                onSignOut={mockOnSignOut}
                onOpenAuthModal={mockOnOpenAuthModal}
                onToggle={mockOnToggle}
            />
        );
        const avatar = container.querySelector('img[alt="User Avatar"]'); // Find the avatar by querying the container
        fireEvent.click(avatar); // Open user menu
        const signOutButton = getByText("Sign Out");
        fireEvent.click(signOutButton);
        expect(mockOnSignOut).toHaveBeenCalledTimes(1);
    });

    it("calls onOpenAuthModal when 'Sign In' is clicked", () => {
        const { getByText } = render(
            <AppHeader
                isAuthenticated={false}
                userEmail=""
                onSignOut={mockOnSignOut}
                onOpenAuthModal={mockOnOpenAuthModal}
                onToggle={mockOnToggle}
            />
        );
        const signInButton = getByText(/Sign In/i); // Using regular expression
        fireEvent.click(signInButton);
        expect(mockOnOpenAuthModal).toHaveBeenCalledTimes(1);
    });

    it("calls onToggle when the menu icon is clicked", () => {
        const { getByLabelText } = render(
            <AppHeader
                isAuthenticated={true}
                userEmail="test@example.com"
                onSignOut={mockOnSignOut}
                onOpenAuthModal={mockOnOpenAuthModal}
                onToggle={mockOnToggle}
            />
        );
        const menuIcon = getByLabelText("open drawer");
        fireEvent.click(menuIcon);
        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
});
