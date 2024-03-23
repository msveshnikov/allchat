import React from "react";
import { render } from "@testing-library/react";
import FileSelector from "../FileSelector";
import "@testing-library/jest-dom/extend-expect";

describe("FileSelector Component", () => {
    it("renders without crashing", () => {
        render(<FileSelector />);
    });

    // it("calls onFileSelect callback when a file is selected", () => {
    //     const onFileSelectMock = jest.fn();
    //     const { getByLabelText } = render(<FileSelector onFileSelect={onFileSelectMock} />);
    //     const fileInput = getByLabelText("Upload PDF, Word, Excel or image");

    //     fireEvent.change(fileInput, { target: { files: [new File([""], "test.png", { type: "image/png" })] } });

    //     expect(onFileSelectMock).toHaveBeenCalledTimes(1);
    //     expect(onFileSelectMock).toHaveBeenCalledWith(expect.any(File));
    // });

    // it("displays a circle icon when a file is selected", () => {
    //     const { getByTestId, getByLabelText } = render(<FileSelector />);
    //     const fileInput = getByLabelText("Upload PDF, Word, Excel or image");

    //     fireEvent.change(fileInput, { target: { files: [new File([""], "test.png", { type: "image/png" })] } });

    //     const circleIcon = getByTestId("circle-icon");
    //     expect(circleIcon).toBeInTheDocument();
    // });
});
