import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatHistory from "../ChatHistory";
import "@testing-library/jest-dom";

jest.mock("react-syntax-highlighter/dist/esm/styles/hljs/monokai", () => ({}));
const mockClipboardWriteText = jest.fn();
navigator.clipboard = {
    writeText: mockClipboardWriteText,
};

describe("ChatHistory", () => {
    const mockChatHistory = [
        {
            user: "Hello! Whats in PDF?",
            assistant:
                "Hello, how can I assist you today? ```Dockerfile # Use the official Node.js image as the base image FROM node:18 # Set the working directory in the container WORKDIR /app # Copy the package.json and package-lock.json files COPY package*.json ./ # Install the dependencies RUN npm install # Copy the rest of the application code COPY . . # Expose the port that your backend runs on EXPOSE 3000 # Start the backend application CMD  ```",
            fileType: "pdf",
            userImageData: "base64data...",
            image: null,
        },
        {
            user: "Whats on photo?",
            assistant: `This is apple # ALLCHAT

            Node.js backend and a React MUI frontend for an application that interacts with the Gemini Pro 1.5 model, with history, image generating/recognition, PDF/Word/Excel upload and markdown support. Written fully by _Claude 3 Sonnet_.
            
            ![image](https://github.com/msveshnikov/allchat/assets/8682996/42b2e4f2-b91b-4712-8ef2-630ebb8919e9)
            
            ## Demo
            
            https://allchat.online/
            
            **Backend (Node.js)**`,
            fileType: "png",
            userImageData: "base64data...",
            image: null,
        },
        {
            user: "Hello",
            error: "An error occurred",
        },
        {
            user: "Paint something",
            assistant: "Here is the response with an image https://example.com and `js\nconst x = 10;\n`",
            fileType: "msword",
            userImageData: null,
            image: "base64data...",
        },
        {
            user: "Hello",
            assistant: null,
            fileType: "vnd.ms-excel",
            userImageData: null,
            image: null,
        },
    ];

    it("should copy code to clipboard on button click", async () => {
        const codeValue = "const myVariable = 'Hello World';";
        const chatHistory = [{ assistant: "```js\n" + codeValue + "\n```" }];
        const { getByLabelText } = render(<ChatHistory chatHistory={chatHistory} />);

        const copyButton = getByLabelText("Copy code");
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(codeValue);
    });

    test("renders chat history", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const chatItems = screen.getAllByTestId("chat-item");
        expect(chatItems).toHaveLength(mockChatHistory.length);
    });

    test("renders user message", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const userMessages = screen.getAllByText("Hello");
        expect(userMessages).toHaveLength(mockChatHistory.filter((h) => h.user === "Hello").length);
    });

    test("renders assistant message", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const assistantMessage = screen.getByText("Hello, how can I assist you today?");
        expect(assistantMessage).toBeInTheDocument();
    });

    test("renders error message", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const errorMessage = screen.getByText("An error occurred");
        expect(errorMessage).toBeInTheDocument();
    });

    test("renders user image data", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const userImageData = screen.getByAltText("User input");
        expect(userImageData).toBeInTheDocument();
    });

    test("renders model output image", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const modelOutputImage = screen.getByAltText("Model output");
        expect(modelOutputImage).toBeInTheDocument();
    });

    test("renders file type icon", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={false} chatContainerRef={null} />);
        const fileTypeIcon = screen.getByText("📃");
        expect(fileTypeIcon).toBeInTheDocument();
    });

    test("renders loading spinner when model is responding", () => {
        render(<ChatHistory chatHistory={mockChatHistory} isModelResponding={true} chatContainerRef={null} />);
        const loadingSpinner = screen.getByRole("progressbar");
        expect(loadingSpinner).toBeInTheDocument();
    });
});

describe("Lightbox", () => {
    const chatHistory = [
        {
            user: "User",
            assistant: null,
            image: [Buffer.from("test image 1", "utf8"), Buffer.from("test image 2", "utf8")],
        },
        {
            user: "User",
            assistant: null,
            image: Buffer.from("test image 3", "utf8"),
        },
    ];

    test("renders images correctly", () => {
        const { getAllByAltText } = render(<ChatHistory chatHistory={chatHistory} />);
        const images = getAllByAltText("AI Generated");
        expect(images.length).toBe(2);
    });

    test("opens lightbox when image is clicked", () => {
        const { getAllByAltText, getAllByRole } = render(<ChatHistory chatHistory={chatHistory} />);
        const images = getAllByAltText("AI Generated");
        expect(images.length === 2);
        fireEvent.click(images[0]);
        const lightbox = getAllByRole("img");
        expect(lightbox.length === 3);
    });

    test("opens correct image in lightbox", () => {
        const { getAllByAltText, getAllByRole } = render(<ChatHistory chatHistory={chatHistory} />);
        const images = getAllByAltText("AI Generated");
        fireEvent.click(images[1]);
        const lightbox = getAllByRole("img");
        expect(lightbox[2]).toHaveAttribute("src", `data:image/png;base64,${chatHistory[1].image.toString("base64")}`);
    });

    test("closes lightbox when clicked outside", () => {
        const { getAllByAltText, queryAllByRole, getAllByTestId, getAllByRole } = render(
            <ChatHistory chatHistory={chatHistory} />
        );
        const images = getAllByAltText("AI Generated");
        fireEvent.click(images[0]);
        const lightbox = getAllByRole("img");
        expect(lightbox[0]).toBeInTheDocument();
        const chatItem = getAllByTestId("chat-item");
        fireEvent.click(chatItem[0]);
        expect(queryAllByRole("img").length === 2);
    });
});
