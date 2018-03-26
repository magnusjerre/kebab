module.exports = {
    entry: ["whatwg-fetch", "./src/index.tsx"],
    devtool: "inline-source-map",
    output: {
        filename: "bundle.js",
        path: __dirname + "/../build/resources/main/static/js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "./../images/[name].[ext]"    //The path relative to entry.js to the images location
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js"]
    }
}