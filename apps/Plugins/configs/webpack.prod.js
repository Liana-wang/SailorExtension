const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(baseConfig({mode: 'production'}), {
    mode: 'production',
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    filter: (source) => {
                        return !source.includes('index.html')
                    },
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
        }),
        new CompressionPlugin({
            test: /\.(js|css)$/,
            filename: '[path][base].gz',
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.log'],
                    },
                },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                vendors: { // 提取node_modules代码
                    test: /node_modules/,
                    name: 'vendors',
                    minChunks: 1,
                    chunks: 'initial',
                    minSize: 0,
                    priority: 1,
                },
                commons: {
                    name: 'commons',
                    minChunks: 2,
                    chunks: 'initial',
                    minSize: 0,
                },
            },
        },
    },
})