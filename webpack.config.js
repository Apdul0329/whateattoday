import webpackNodeExternals from "webpack-node-externals";

const nodeExternals = webpackNodeExternals();

mudule.exports = {
    target: 'node',
    nodeExternals: [nodeExternals()],
    entry: './',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
}