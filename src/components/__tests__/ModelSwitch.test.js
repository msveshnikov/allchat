import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ModelSwitch from "../ModelSwitch";
import '@testing-library/jest-dom'

describe("ModelSwitch Component", () => {
    it("renders with default props", () => {
        const { getByLabelText } = render(<ModelSwitch model="gemini" />);
        const switchElement = getByLabelText("Gemini Pro");

        expect(switchElement).toBeInTheDocument();
    });

    it("changes model on switch toggle", () => {
        const onModelChangeMock = jest.fn();
        const { getByLabelText } = render(<ModelSwitch model="gemini" onModelChange={onModelChangeMock} />);
        const switchElement = getByLabelText("Gemini Pro");

        fireEvent.click(switchElement);

        expect(onModelChangeMock).toHaveBeenCalledWith("claude");
    });

    it("displays correct label based on model prop", () => {
        const { getByLabelText, rerender } = render(<ModelSwitch model="gemini" />);
        let switchElement = getByLabelText("Gemini Pro");

        expect(switchElement).toBeInTheDocument();

        rerender(<ModelSwitch model="claude" />);

        switchElement = getByLabelText("Claude Haiku");

        expect(switchElement).toBeInTheDocument();
    });
});
