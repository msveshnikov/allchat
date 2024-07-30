/* eslint-disable no-new-func */
import React, { useState, useEffect, useContext } from "react";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { OpenScad } from "./OpenScad";
import { MermaidChart } from "./MermaidChart";
import * as Babel from "@babel/standalone";
import { API_URL } from "./Main";
import { animateScroll as scroll } from "react-scroll";
import { ViewToggle } from "./ViewToggle";

export const detectLanguage = (code) => {
    if (code.includes("def ") || code.includes("import ")) return "python";
    if (code.includes("function ") || code.includes("const ")) return "js";
    if (code.includes("public class ") || code.includes("System.out.println")) return "java";
    return "python";
};

export const ArtifactViewer = ({ type, content, name }) => {
    const [view, setView] = useState("preview");
    const [executionResult, setExecutionResult] = useState(null);

    const handleViewChange = (event, value) => {
        if (value !== null) {
            setView(value);
        }
    };

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

            const ComponentFunction = new Function(
                "React",
                "useState",
                "useEffect",
                "useContext",
                `
                ${transformedCode}
                return ${componentName};
            `
            );
            const DynamicComponent = ComponentFunction(React, useState, useEffect, useContext);
            return React.createElement(DynamicComponent);
        } catch (error) {
            return <p style={{ color: "red" }}>Error rendering React component: {error.message}</p>;
        }
    };

    const handleRun = async (language, program) => {
        if (language !== "python") {
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            setExecutionResult({ loading: true });

            const response = await fetch(API_URL + "/run", {
                method: "POST",
                headers,
                body: JSON.stringify({ program }),
            });

            const data = await response.json();
            if (response.ok) {
                setExecutionResult({
                    output: data.output,
                    image: data.imageResponse,
                });
                scroll.scrollToBottom({
                    containerId: "artifact",
                    duration: 500,
                    smooth: true,
                });
            } else {
                setExecutionResult({
                    error: data.error,
                });
            }
        } catch (error) {
            setExecutionResult({
                error: "Failed to connect to the server or server timeout",
            });
        }
    };

    const renderExecutionResult = () => {
        if (!executionResult) return null;
        if (executionResult.loading) return <Typography>Running code...</Typography>;
        if (executionResult.error)
            return <Typography style={{ color: "red" }}>Error: {executionResult.error}</Typography>;
        return (
            <div>
                <h4>Execution Result:</h4>
                <pre>{executionResult.output}</pre>
                {executionResult.image.length > 0 && (
                    <img
                        src={`data:image/png;base64,${executionResult.image[0].toString("base64")}`}
                        alt="Execution result"
                    />
                )}
            </div>
        );
    };

    switch (type) {
        case "html":
        case "svg":
            return (
                <Box width="100%">
                    <ViewToggle view={view} handleViewChange={handleViewChange} />
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
                    <ViewToggle view={view} handleViewChange={handleViewChange} />
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
        case "python":
            return (
                <Box width="100%" overflow="auto">
                    <CodeBlock language={detectLanguage(content)} value={content} onRun={handleRun} />
                    {renderExecutionResult()}
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
