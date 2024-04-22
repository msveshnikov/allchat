import * as pdfMake from "pdfmake/build/pdfmake.min";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const styles = {
    userMessage: {
        fontSize: 12,
        bold: true,
        alignment: "right",
        margin: [0, 10, 0, 5],
    },
    assistantMessage: {
        fontSize: 12,
        margin: [0, 5, 0, 10],
    },
};

const generatePdfDocDefinition = async (chatHistory) => {
    const docDefinition = {
        content: [],
        styles: styles,
    };

    for (const chat of chatHistory) {
        if (chat.user) {
            docDefinition.content.push({ text: chat.user, style: "userMessage" });
        }

        if (chat.assistant) {
            const content = [];
            const assistantText = chat.assistant;

            if (chat.image) {
                const imageDataUrl = Array.isArray(chat.image)
                    ? await Promise.all(chat.image.map(async (imgData) => await html2canvas(imgData)))
                    : await html2canvas(chat.image);

                const images = Array.isArray(imageDataUrl)
                    ? imageDataUrl.map((canvas) => canvas.toDataURL("image/png"))
                    : [imageDataUrl.toDataURL("image/png")];

                content.push(...images.map((img) => ({ image: img, width: 300 })));
            }

            content.push({ text: assistantText, style: "assistantMessage" });
            docDefinition.content.push(...content);
        }
    }

    return docDefinition;
};

export const generatePdfFromChatHistories = async (chatHistories) => {
    const docDefinitions = await Promise.all(chatHistories.map((history) => generatePdfDocDefinition(history)));
    const mergedDefinition = {
        content: [].concat(...docDefinitions.map((def) => def.content)),
        styles: styles,
    };

    pdfMake.createPdf(mergedDefinition).download("chat_histories.pdf");
};
