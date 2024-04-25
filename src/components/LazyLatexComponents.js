import loadable from "@loadable/component";
import React from "react";

const LazyInlineMath = loadable(
    (props) =>
        import("react-katex").then((module) => {
            module.load();
            return module.InlineMath;
        }),
    {
        fallback: <div>Loading...</div>,
    }
);

const LazyBlockMath = loadable(
    (props) =>
        import("react-katex").then((module) => {
            module.load();
            return module.BlockMath;
        }),
    {
        fallback: <div>Loading...</div>,
    }
);

export const LazyLatexComponents = {
    inlineMath: (props) => <LazyInlineMath {...props} />,
    blockMath: (props) => <LazyBlockMath {...props} />,
};

export const load = () => {
    import("katex/dist/katex.min.css");
};
