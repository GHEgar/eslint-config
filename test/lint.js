import { ESLint } from 'eslint';
import globals from 'globals';
import base from '../src/base.js';
import react from '../src/react.js';
import ts from '../src/ts.js';

const node = [{ languageOptions: { globals: globals.node } }];

export const presets = { base, react, ts, node };

export function compose(...names) {
    return names.flatMap((name) => presets[name]);
}

export async function lint(code, filePath, names = ['base']) {
    const eslint = new ESLint({
        cwd: import.meta.dirname,
        overrideConfigFile: true,
        overrideConfig: compose(...names),
    });
    const [result] = await eslint.lintText(code, { filePath });
    const fatal = result.messages.find((message) => message.fatal);
    if (fatal) {
        throw new Error(fatal.message);
    }
    return result.messages.map(({ ruleId, severity }) => ({ ruleId, severity }));
}

export async function ruleIds(code, filePath, names) {
    const messages = await lint(code, filePath, names);
    return [...new Set(messages.map(({ ruleId }) => ruleId))].sort();
}

export async function severityOf(rule, filePath, names) {
    const eslint = new ESLint({
        cwd: import.meta.dirname,
        overrideConfigFile: true,
        overrideConfig: compose(...names),
    });
    const config = await eslint.calculateConfigForFile(filePath);
    const value = config.rules[rule];
    return Array.isArray(value) ? value[0] : value;
}
