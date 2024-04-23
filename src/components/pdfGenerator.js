import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const styles = {
    userMessage: {
        fontSize: 12,
        bold: true,
        alignment: "right",
        margin: [0, 10, 0, 5],
        backgroundColor: "#e8f5e9", // Light green background for assistant messages
        color: "#33691e", // Dark green text color for assistant messages
        padding: [5, 10], // Add some padding for better readability
        borderRadius: 5, // Round the corners of the bubble
    },
    assistantMessage: {
        fontSize: 12,
        margin: [0, 5, 0, 10],
        backgroundColor: "#e1f5fe", // Light blue background for user messages
        color: "#01579b", // Dark blue text color for user messages
        padding: [5, 10], // Add some padding for better readability
        borderRadius: 5, // Round the corners of the bubble
    },
};

const generatePdfDocDefinition = (chatHistory) => {
    const docDefinition = {
        content: [],
        styles: styles,
    };

    for (const chat of chatHistory) {
        if (chat.user || chat.userImageData) {
            const content = [];
            if (chat.userImageData && (chat.fileType === "png" || chat.fileType === "jpeg")) {
                content.push({
                    image: `data:image/${chat.fileType};base64,` + chat.userImageData,
                    width: 500,
                });
            }
            content.push({ text: chat.user, style: "userMessage" });
            docDefinition.content.push(...content);
        }

        if (chat.assistant) {
            const content = [];
            if (chat.image) {
                const images = Array.isArray(chat.image)
                    ? chat.image.map((imgData) => {
                          return { image: "data:image/png;base64," + imgData, width: 500 };
                      })
                    : [{ image: "data:image/png;base64," + chat.image, width: 500 }];
                content.push(...images);
            }
            content.push({ text: chat.assistant, style: "assistantMessage" });
            docDefinition.content.push(...content);
        }
    }

    return docDefinition;
};

const generatePdfFromChatHistories = (chatHistories) => {
    const docDefinitions = chatHistories.map((history) => generatePdfDocDefinition(history));
    const mergedDefinition = {
        content: [].concat(...docDefinitions.map((def) => def.content)),
        styles: styles,
    };

    pdfMake.createPdf(mergedDefinition).download("chat_histories.pdf");
};

export default generatePdfFromChatHistories;
