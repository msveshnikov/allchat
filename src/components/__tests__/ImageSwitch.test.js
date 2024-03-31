import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ImagesSwitch from "../ImagesSwitch";

describe("ImagesSwitch", () => {
    it("renders correctly with default props", () => {
        const { getByLabelText } = render(<ImagesSwitch imagesCount={1} onImagesChange={() => {}} />);
        const switchElement = getByLabelText("1 Image");
        expect(switchElement).toBeInTheDocument();
    });
 
    it("renders correctly with 4 images", () => {
        const { getByLabelText } = render(<ImagesSwitch imagesCount={4} onImagesChange={() => {}} />);
        const switchElement = getByLabelText("4 Images");
        expect(switchElement).toBeInTheDocument();
    });
 
    it("calls onImagesChange with 1 when switch is toggled from 4 to 1", () => {
        const onImagesChange = jest.fn();
        const { getByRole } = render(<ImagesSwitch imagesCount={4} onImagesChange={onImagesChange} />);
        const switchElement = getByRole("checkbox");
        fireEvent.click(switchElement);
        expect(onImagesChange).toHaveBeenCalledWith(1);
    });

    it("calls onImagesChange with 4 when switch is toggled from 1 to 4", () => {
        const onImagesChange = jest.fn();
        const { getByRole } = render(<ImagesSwitch imagesCount={1} onImagesChange={onImagesChange} />);
        const switchElement = getByRole("checkbox");
        fireEvent.click(switchElement);
        expect(onImagesChange).toHaveBeenCalledWith(4);
    }); 
});
