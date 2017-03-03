const webpack = require('webpack');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        reporters: ['spec'],
        files: [
            {pattern: 'spec/**/*.js'}
        ],
        preprocessors: {
            './src/*.js': ['webpack'],
            './spec/**/*.js': ['webpack']
        },
        browsers: ["Chrome"],
        webpack: {
            module: {
                loaders: [
                    {test: /\.js/, exclude: /node_modules/, loader: 'babel-loader'}
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};