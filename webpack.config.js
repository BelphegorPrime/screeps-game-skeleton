var webpack = require('webpack');
var path = require('path');
module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
        ],
    },
    output: {
        filename: './main2.js',
        pathinfo: true,
        libraryTarget: 'commonjs2',
        sourceMapFilename: '[file].map.js', // normally this is [file].map, but we need a js file, or it will be rejected by screeps server.
        devtoolModuleFilenameTemplate: '[resource-path]',
    },
    target: 'node',
    node: {
        console: true,
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    },
};