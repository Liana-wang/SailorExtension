const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig({mode: 'development'}), {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            "@sailor-extension/utils": path.resolve(__dirname, '../../../packages/utils/src'),
            "@sailor-extension/core": path.resolve(__dirname, '../../../packages/core/src'),
            "@sailor-extension/common": path.resolve(__dirname, '../../../packages/common/src'),
        },
    },
    devServer: {
        port: 3008,
        compress: false,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        hot: true,
        'static': { // 托管静态资源文件
            directory: path.join(__dirname, '../public'),
        },
        https: true,
    },
    devtool: 'eval-cheap-module-source-map',
})