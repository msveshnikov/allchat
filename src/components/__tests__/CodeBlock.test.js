import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeBlock } from "../CodeBlock";

describe("CodeBlock", () => {
    const code = `console.log('Hello, World!')`;
    const language = "js";

    it("clicks the run button", () => {
        const mockRunCode = jest.fn();
        render(<CodeBlock language={language} value={code} onRun={mockRunCode} />);
        const runButton = screen.getByRole("button", { name: "Run code" });
        fireEvent.click(runButton);
        expect(mockRunCode).toHaveBeenCalledTimes(1);
    });

});
