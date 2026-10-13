import { describe, expect, it } from 'vitest';
import { ruleIds } from './lint.js';

const file = 'src/sample.ts';

describe('ts', () => {
    it('parses TypeScript and keeps the base formatting rules', async () => {
        const code = 'export type Point = { x: number };\nexport const origin: Point = { x: 0 }\n';
        expect(await ruleIds(code, file, ['base', 'ts'])).toEqual(['@stylistic/semi']);
    });

    it('swaps no-unused-vars for the typescript-eslint version', async () => {
        const code = 'const unused: number = 1;\nconst [_a, b] = [1, 2];\nexport function f(_x: number): number {\n    return b;\n}\n';
        expect(await ruleIds(code, file, ['base', 'ts'])).toEqual(['@typescript-eslint/no-unused-vars']);
    });

    it('swaps no-use-before-define for the typescript-eslint version', async () => {
        const code = 'export const a = b;\nconst b = 1;\n';
        const rules = await ruleIds(code, file, ['base', 'ts']);
        expect(rules).toContain('@typescript-eslint/no-use-before-define');
        expect(rules).not.toContain('no-use-before-define');
    });

    it('does not flag types used before their declaration as undefined', async () => {
        const code = 'export function f(p: Shape): number {\n    return p.size;\n}\ninterface Shape {\n    size: number;\n}\n';
        expect(await ruleIds(code, file, ['base', 'ts'])).toEqual([]);
    });

    it('applies the strict preset', async () => {
        const code = 'export const a = (x: unknown) => x as any;\n';
        expect(await ruleIds(code, file, ['base', 'ts'])).toEqual(['@typescript-eslint/no-explicit-any']);
    });

    it('leaves JavaScript files to the core rules', async () => {
        expect(await ruleIds('const unused = 1;\n', 'src/sample.js', ['base', 'ts'])).toEqual(['no-unused-vars']);
    });

    it('composes with the react preset on .tsx files', async () => {
        const code = 'export function A({ n }: { n: number }) {\n    return <img src="a.webp" alt={String(n)} />;\n}\n';
        expect(await ruleIds(code, 'src/A.tsx', ['base', 'react', 'ts'])).toEqual([]);
    });
});
