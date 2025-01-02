module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'import',
        'prettier',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        'import/order': [
            'error',
            {
                groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'no-console': 'warn',
        'no-debugger': 'error',
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
