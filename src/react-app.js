import reactRefresh from 'eslint-plugin-react-refresh';
import { files } from './react.js';

export default [
    {
        name: '@npmegar/react-app/refresh',
        files,
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
];
