import nodeExternals from 'webpack-node-externals'

const target = 'node'
const externals = [nodeExternals()]
const entry = './'

export {
    target,
    externals,
    entry
}