const nodeExternals = require('webpack-node-externals')

mudule.exports = {
    target: 'node',
    nodeExternals: [nodeExternals()],
    entry: './',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
}