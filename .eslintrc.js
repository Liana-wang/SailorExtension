module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    'extends': [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {

        'no-console': 'warn',
        'no-var': 'warn',
        'object-curly-spacing': [
            'warn',
            'always',
        ],
        'comma-spacing': 'warn',
        'spaced-comment': 'warn',
        'no-restricted-properties': [
            'warn',
            {
                property: 'pop',
            },
            {
                property: 'push',
            },
            {
                property: 'shift',
            },
            {
                property: 'unshift',
            },
            {
                property: 'splice',
            },
        ],
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'always-multiline',
            },
        ],
        'arrow-parens': 'error',
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
            },
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                ImportDeclaration: 'first',
            },
        ],
        curly: 'error',
        'quote-props': [
            'error',
            'as-needed',
            {
                keywords: true,
                numbers: true,
            },
        ],
        'no-constant-condition': 'off',
        'no-undef': 'off',
        'no-empty': 'off',
        'no-extra-boolean-cast': 'off',
        'dot-notation': 'off',
        'no-useless-escape': 'off',
        'no-fallthrough': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/semi': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-array-constructor': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/prefer-interface': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-triple-slash-reference': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
    },
}
