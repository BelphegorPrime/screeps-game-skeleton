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
};

