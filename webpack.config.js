const path = require("path");

module.exports = {
    entry: "./src/yash.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "yash.js"
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    }
};