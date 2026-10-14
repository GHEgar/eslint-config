import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export const unusedVarsOptions = {
    varsIgnorePattern: '^[A-Z_]',
    argsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
};

export const useBeforeDefineOptions = {
    functions: false,
    classes: true,
    variables: false,
};

export const testFiles = [
    '**/*.test.{js,jsx,mjs,cjs,ts,tsx,mts,cts}',
    '**/test/**',
    '**/tests/**',
];

export default [
    {
        name: '@npmegar/base/ignores',
        ignores: ['dist/', 'coverage/', '**/test-results/', '**/playwright-report/'],
    },
    {
        name: '@npmegar/base/recommended',
        ...js.configs.recommended,
    },
    {
        name: '@npmegar/base/rules',
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'always' }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/template-curly-spacing': ['error', 'never'],
            'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
            'no-unused-vars': ['error', unusedVarsOptions],
            'no-use-before-define': ['error', useBeforeDefineOptions],
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    {
        name: '@npmegar/base/tests',
        files: testFiles,
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.vitest,
            },
        },
    },
];
