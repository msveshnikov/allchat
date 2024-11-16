import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Markdown from "markdown-it";
import htmlToPdfmake from "html-to-pdfmake";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const md = new Markdown();

const styles = {
    userMessage: {
        fontSize: 12,
        bold: true,
        alignment: "right",
        margin: [0, 10, 0, 5],
        backgroundColor: "#e8f5e9",
        color: "#33691e",
        padding: [5, 10],
        borderRadius: 5,
    },
    assistantMessage: {
        fontSize: 12,
        margin: [0, 5, 0, 10],
        backgroundColor: "#e1f5fe",
        color: "#01579b",
        padding: [5, 10],
        borderRadius: 5,
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
                    width: 400,
                });
            }
            content.push({ text: chat.user, style: "userMessage" });
            docDefinition.content.push(...content);
        }

        if (chat.assistant) {
            const content = [];
            if (chat.image) {
                const images = [{ image: "data:image/png;base64," + chat.image, width: 400 }];
                content.push(...images);
            }
            const renderedMarkdown = md.render(chat.assistant.replace(/!\[.*?\]\(.*?\)/g, ""));
            const pdfmakeContent = htmlToPdfmake(renderedMarkdown);
            content.push(pdfmakeContent);
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
