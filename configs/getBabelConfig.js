module.exports = function (modules) {
    return {
        babelrc: false,
        presets: [
            [
                '@babel/preset-env', {
                    modules,
                    targets: {
                        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
                    },
                },
            ],
            [
                '@babel/preset-react', {
                    runtime: 'automatic',
                },
            ],
            '@babel/preset-typescript',
        ],
        plugins: [
            '@babel/plugin-transform-object-rest-spread',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-classes',
        ],
    }
}
