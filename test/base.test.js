import { describe, expect, it } from 'vitest';
import { ruleIds } from './lint.js';

const file = 'src/sample.js';
const withNode = ['base', 'node'];

describe('base', () => {
    it('accepts code that follows every rule', async () => {
        const code = [
            'const KEY = \'a\';',
            'const name = "it\'s";',
            'const label = `${name} ok`;',
            'function pick(value, _unused) {',
            '    switch (value) {',
            '        case KEY:',
            '            return label;',
            '        default:',
            '            return helper();',
            '    }',
            '}',
            'function helper() {',
            '    console.warn(\'x\');',
            '    return null;',
            '}',
            'export { pick };',
            '',
        ].join('\n');
        expect(await ruleIds(code, file, withNode)).toEqual([]);
    });

    it('requires 4-space indent with indented case', async () => {
        const code = 'export function f(v) {\n    switch (v) {\n    case 1:\n        return 1;\n    }\n  return 0;\n}\n';
        expect(await ruleIds(code, file)).toEqual(['@stylistic/indent']);
    });

    it('requires single quotes', async () => {
        expect(await ruleIds('export const a = "x";\n', file)).toEqual(['@stylistic/quotes']);
    });

    it('requires semicolons', async () => {
        expect(await ruleIds('export const a = 1\n', file)).toEqual(['@stylistic/semi']);
    });

    it('forbids spaces inside template curlies', async () => {
        const code = 'const a = 1;\nexport const b = `${ a }`;\n';
        expect(await ruleIds(code, file)).toEqual(['@stylistic/template-curly-spacing']);
    });

    it('reports unused variables unless they match the ignore patterns', async () => {
        expect(await ruleIds('const unused = 1;\n', file)).toEqual(['no-unused-vars']);
        const ignored = 'const UNUSED = 1;\nconst [_a, b] = [1, 2];\nexport function f(_x) {\n    return b;\n}\n';
        expect(await ruleIds(ignored, file)).toEqual([]);
    });

    it('reports variables used before their definition in the same scope', async () => {
        expect(await ruleIds('export const a = b;\nconst b = 1;\n', file)).toContain('no-use-before-define');
        const inner = 'export function f() {\n    const x = y + 1;\n    const y = 2;\n    return x;\n}\n';
        expect(await ruleIds(inner, file)).toContain('no-use-before-define');
    });

    it('allows closures and hoisted functions that reference later declarations', async () => {
        const closure = 'export function f() {\n    const stop = () => clearTimeout(timer);\n    const timer = setTimeout(stop, 1);\n}\n';
        expect(await ruleIds(closure, file, withNode)).toEqual([]);
        expect(await ruleIds('export const a = f();\nfunction f() {\n    return 1;\n}\n', file)).toEqual([]);
    });

    it('allows console.warn and console.error only', async () => {
        expect(await ruleIds('console.log(1);\n', file, withNode)).toEqual(['no-console']);
        expect(await ruleIds('console.error(1);\n', file, withNode)).toEqual([]);
    });

    it('caps files at 300 lines of code, ignoring blanks and comments', async () => {
        const lines = (count) => Array.from({ length: count }, (_, i) => `export const v${i} = ${i};`);
        const padded = [...lines(300), '', '// note', '/* block */', ''].join('\n');
        expect(await ruleIds(padded, file)).toEqual([]);
        expect(await ruleIds(lines(301).join('\n') + '\n', file)).toEqual(['max-lines']);
    });

    it('declares no environment globals', async () => {
        expect(await ruleIds('console.error(1);\n', file)).toEqual(['no-undef']);
    });

    it('ignores build output and test artifacts', async () => {
        const { ESLint } = await import('eslint');
        const { default: base } = await import('../src/base.js');
        const eslint = new ESLint({ cwd: import.meta.dirname, overrideConfigFile: true, overrideConfig: base });
        const paths = ['dist/a.js', 'coverage/a.js', 'test-results/a.js', 'playwright-report/a.js', 'packages/x/test-results/a.js'];
        for (const path of paths) {
            expect(await eslint.isPathIgnored(path), path).toBe(true);
        }
        expect(await eslint.isPathIgnored('src/a.js')).toBe(false);
    });

    it('applies the recommended rules', async () => {
        expect(await ruleIds('export const a = undeclared;\n', file)).toEqual(['no-undef']);
    });

    it('gives test files Node and Vitest globals', async () => {
        const code = 'describe(\'x\', () => {\n    it(\'y\', () => expect(process.env).toBeTruthy());\n});\n';
        expect(await ruleIds(code, 'src/sample.test.js')).toEqual([]);
        expect(await ruleIds(code, 'test/sample.js')).toEqual([]);
        expect(await ruleIds(code, file)).toContain('no-undef');
    });
});
