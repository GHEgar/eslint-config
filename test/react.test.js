import { describe, expect, it } from 'vitest';
import { ruleIds, severityOf } from './lint.js';

const file = 'src/Sample.jsx';
const names = ['base', 'react'];

describe('react', () => {
    it('accepts a well-formed component with browser globals', async () => {
        const code = [
            'import { useState } from \'react\';',
            '',
            'export function Counter() {',
            '    const [count, setCount] = useState(0);',
            '    return <button type="button" onClick={() => setCount(count + window.devicePixelRatio)}>{count}</button>;',
            '}',
            '',
        ].join('\n');
        expect(await ruleIds(code, file, names)).toEqual([]);
    });

    it('enforces the rules of hooks', async () => {
        const code = 'import { useState } from \'react\';\n\nexport function A({ on }) {\n    if (on) {\n        useState(0);\n    }\n    return null;\n}\n';
        expect(await ruleIds(code, file, names)).toEqual(['react-hooks/rules-of-hooks']);
    });

    it('runs jsx-a11y', async () => {
        const code = 'export function A() {\n    return <img src="a.webp" />;\n}\n';
        expect(await ruleIds(code, file, names)).toEqual(['jsx-a11y/alt-text']);
    });

    it('leaves fast refresh out of the library preset', async () => {
        const code = 'export function A() {\n    return null;\n}\nexport function helper() {\n    return 1;\n}\n';
        expect(await ruleIds(code, file, names)).toEqual([]);
        expect(await ruleIds(code, file, [...names, 'reactApp'])).toEqual(['react-refresh/only-export-components']);
    });

    it('downgrades the React Compiler rules to warnings', async () => {
        const rules = [
            'react-hooks/set-state-in-effect',
            'react-hooks/refs',
            'react-hooks/immutability',
            'react-hooks/preserve-manual-memoization',
            'react-hooks/exhaustive-deps',
        ];
        for (const rule of rules) {
            expect(await severityOf(rule, file, names), rule).toBe(1);
        }
        expect(await severityOf('react-hooks/rules-of-hooks', file, names)).toBe(2);
    });

    it('covers hooks written in plain .js files', async () => {
        const code = 'import { useState } from \'react\';\n\nexport function useThing(on) {\n    if (on) {\n        useState(0);\n    }\n}\n';
        expect(await ruleIds(code, 'src/useThing.js', names)).toEqual(['react-hooks/rules-of-hooks']);
    });
});
