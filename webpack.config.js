const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'node',
    nodeExternals: [nodeExternals()],
    entry: './',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
}