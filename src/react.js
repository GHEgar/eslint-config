import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

const files = ['**/*.{js,jsx,mjs,ts,tsx,mts}'];

const hooksRecommended = reactHooks.configs.flat['recommended-latest'];

export default [
    {
        name: '@ghegar/react/language',
        files,
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
    },
    {
        name: '@ghegar/react/hooks',
        files,
        plugins: hooksRecommended.plugins,
        rules: {
            ...hooksRecommended.rules,
            'react-hooks/set-state-in-effect': 'warn',
            'react-hooks/refs': 'warn',
            'react-hooks/immutability': 'warn',
            'react-hooks/preserve-manual-memoization': 'warn',
        },
    },
    {
        name: '@ghegar/react/a11y',
        files,
        plugins: jsxA11y.flatConfigs.recommended.plugins,
        rules: jsxA11y.flatConfigs.recommended.rules,
    },
    {
        name: '@ghegar/react/refresh',
        files,
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
];
