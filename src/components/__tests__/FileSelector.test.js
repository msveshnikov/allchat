import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FileSelector from "../FileSelector";
import '@testing-library/jest-dom'

describe("FileSelector Component", () => {
    it("renders without crashing", () => {
        render(<FileSelector />);
    });

    it("calls onFileSelect callback when a file is selected", () => {
        const onFileSelectMock = jest.fn();
        const { getByTestId } = render(<FileSelector onFileSelect={onFileSelectMock} />);
        const fileInput = getByTestId("file-input");

        const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(onFileSelectMock).toHaveBeenCalledTimes(1);
        expect(onFileSelectMock).toHaveBeenCalledWith(expect.any(File));
    });

    it("displays a circle icon when a file is selected", async () => {
        const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
        const { getByTestId } = render(<FileSelector selectedFile={file} />);

        const circleIcon = getByTestId("circle-icon");
        expect(circleIcon).toBeInTheDocument();
    });
});
