var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: "./dist/main.js",
    output: {
        path: __dirname + "./dist/js",
        filename: "scripts.min.js"
    },
    plugins: [
    ],
};