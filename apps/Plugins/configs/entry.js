const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function createEntry(route) {
    return {
        entry: { [route]: [path.join(__dirname, `../src/entrypoints/${route}/index.tsx`)] },
        htmlWebpackplugins: [
            new HtmlWebpackPlugin({
                filename: path.join(__dirname, `../dist/${route}.html`),
                template: path.join(__dirname, `../public/index.html`),
                chunks: [route],
            }),
        ],
    }
}

function getEntry(route) {
    let res = {
        entry: {},
        htmlWebpackplugins: [],
    }

    if (route !== 'all') {
        res = { ...res, ...createEntry(route) }
    } else {
        const pages = fs.readdirSync(path.join(__dirname, '../src/entrypoints'))

        for (let page of pages) {
            const stats = fs.statSync(path.join(__dirname, `../src/entrypoints/${page}`))

            if (stats.isDirectory()) {
                const { entry, htmlWebpackplugins } = createEntry(page)

                res = {
                    entry: {
                        ...res.entry,
                        ...entry,
                    },
                    htmlWebpackplugins: [
                        ...res.htmlWebpackplugins,
                        ...htmlWebpackplugins,
                    ],
                }
            }
        }
    }

    return res
}

module.exports = getEntry