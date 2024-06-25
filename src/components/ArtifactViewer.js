import React, { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { OpenScad } from "./OpenScad";
import { MermaidChart } from "./MermaidChart";
import * as Babel from "@babel/standalone";

export const detectLanguage = (code) => {
    if (code.includes("def ") || code.includes("import ")) return "python";
    if (code.includes("function ") || code.includes("const ")) return "js";
    if (code.includes("public class ") || code.includes("System.out.println")) return "java";
    return "python";
};

export const ArtifactViewer = ({ type, content, name }) => {
    const [view, setView] = useState("preview");

    const handleViewChange = (event, value) => {
        if (value !== null) {
            setView(value);
        }
    };

    const ViewToggle = () => (
        <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view"
            size="small"
            sx={{ mb: 2, mt: -3 }}
        >
            <ToggleButton value="preview" aria-label="preview">
                Preview
            </ToggleButton>
            <ToggleButton value="code" aria-label="code">
                Code
            </ToggleButton>
        </ToggleButtonGroup>
    );

    const renderReactComponent = (code) => {
        try {
            const codeWithoutImportExport = code
                .replace(/import\s+.*?from\s+['"].*?['"];?/g, "")
                .replace(/export\s+default\s+.*?;?/g, "");

            const componentNameMatch = codeWithoutImportExport.match(/(?:function|class|const)\s+(\w+)/);
            const componentName = componentNameMatch ? componentNameMatch[1] : "Component";

            const transformedCode = Babel.transform(codeWithoutImportExport, {
                presets: ["react"],
            }).code;

            // eslint-disable-next-line no-new-func
            const ComponentFunction = new Function(
                "React",
                `
               ${transformedCode}
               return ${componentName};`
            );

            const DynamicComponent = ComponentFunction(React);
            return React.createElement(DynamicComponent);
        } catch (error) {
            return <p style={{ color: "red" }}>Error rendering React component: {error.message}</p>;
        }
    };

    switch (type) {
        case "html":
            return (
                <Box width="100%">
                    <ViewToggle />
                    {view === "preview" ? (
                        <Box width="100%" height="600px">
                            <iframe
                                srcDoc={content}
                                style={{ width: "100%", height: "100%", border: "none" }}
                                title="HTML Artifact"
                            />
                        </Box>
                    ) : (
                        <Box width="100%" overflow="auto">
                            <CodeBlock language="html" value={content} />
                        </Box>
                    )}
                </Box>
            );
        case "react":
            return (
                <Box width="100%">
                    <ViewToggle />
                    {view === "preview" ? (
                        <Box width="100%">{renderReactComponent(content)}</Box>
                    ) : (
                        <Box width="100%" overflow="auto">
                            <CodeBlock language="jsx" value={content} />
                        </Box>
                    )}
                </Box>
            );
        case "mermaid":
            const mermaidContent =
                content.startsWith("```mermaid") && content.endsWith("```") ? content.slice(10, -3).trim() : content;
            return (
                <Box width="100%">
                    <MermaidChart chart={mermaidContent} />
                </Box>
            );
        case "code":
            return (
                <Box width="100%" overflow="auto">
                    <CodeBlock language={detectLanguage(content)} value={content} />
                </Box>
            );
        case "openscad":
            return <OpenScad content={content} name={name} />;
        case "text":
        case "other":
        default:
            return (
                <Box width="100%" overflow="auto">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
            );
    }
};
