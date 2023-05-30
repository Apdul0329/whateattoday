import nodeExternals from 'webpack-node-externals'

export const target = 'node'
export const externals = [nodeExternals()]
export const entry = './'