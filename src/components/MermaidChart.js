import React, { useEffect } from "react";
import mermaid from "mermaid";

export const MermaidChart = ({ chart }) => {
    useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
        mermaid.contentLoaded();
    }, []);

    return (
        <div>
            <div className="mermaid">{chart}</div>
        </div>
    );
};
