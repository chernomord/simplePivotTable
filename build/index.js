const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let webpackConfig = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "../dist/js"),
        filename: "app.js",
        publicPath: "js/",
        library: "PivotTable",
        libraryTarget: "window"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                }
            }
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".css"],
    },
    devtool: "source-map",
    context: path.resolve(__dirname, "../"),
    target: "web",
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Pivot Table',
            filename: path.resolve(__dirname, "../dist/index.html")
        })
    ]
};

webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            reasons: true,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n')
});
