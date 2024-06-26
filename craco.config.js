module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.ignoreWarnings = [
                {
                    module: /@babel\/standalone/,
                    message: /Critical dependency: the request of a dependency is an expression/,
                },
            ];
            return webpackConfig;
        },
    },
};
