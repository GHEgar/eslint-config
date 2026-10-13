import tseslint from 'typescript-eslint';
import { unusedVarsOptions, useBeforeDefineOptions } from './base.js';

const files = ['**/*.{ts,tsx,mts,cts}'];

export default [
    ...tseslint.configs.strict.map((config) => ({ ...config, files })),
    {
        name: '@ghegar/ts/rules',
        files,
        rules: {
            'no-unused-vars': 'off',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
            '@typescript-eslint/no-use-before-define': ['error', useBeforeDefineOptions],
        },
    },
];
