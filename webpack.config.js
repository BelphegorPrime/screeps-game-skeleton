let path = require('path');
module.exports = {
    target: 'node',
    entry: {
        index: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    }
};