# @ghegar/eslint-config

Shared ESLint flat config. One place for the rules that used to be copied by hand from repo to repo:
4-space indent, single quotes, semicolons and files capped at 300 lines of code.

Four presets that compose: `base`, `react`, `react-app` and `ts`. Each one is a plain array of flat config objects.

## Install

```bash
npm install -D @ghegar/eslint-config eslint
```

Each preset needs its own plugins:

| Preset | Peer dependencies |
|---|---|
| `base` | `eslint` |
| `react` | `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` |
| `react-app` | `eslint-plugin-react-refresh` |
| `ts` | `typescript-eslint`, `typescript` |

`eslint-plugin-jsx-a11y` 6.10 does not list ESLint 10 as a peer yet. Add an override to your
`package.json`:

```json
{
    "overrides": {
        "eslint-plugin-jsx-a11y": {
            "eslint": "$eslint"
        }
    }
}
```

## Use

```js
import base from '@ghegar/eslint-config';
import react from '@ghegar/eslint-config/react';
import reactApp from '@ghegar/eslint-config/react-app';
import ts from '@ghegar/eslint-config/ts';

export default [
    ...base,
    ...react,
    ...reactApp,
    ...ts,
];
```

No preset includes another: always spread `base` first, and `react` before `react-app`. Libraries
skip `react-app`.

## What each preset does

**`base`**

- `@eslint/js` recommended rules.
- `@stylistic/indent` 4 with `SwitchCase: 1`, `@stylistic/quotes` single (escapes and template
  literals allowed), `@stylistic/semi` always, `@stylistic/template-curly-spacing` never.
- `max-lines`: 300, blank lines and comments not counted.
- `no-unused-vars`: ignores `^[A-Z_]` variables and `^_` arguments and destructured elements.
- `no-use-before-define`: same-scope references only, so closures over later declarations pass.
- `no-console`: only `console.warn` and `console.error`.
- Node and Vitest globals for `**/*.test.*`, `**/test/**` and `**/tests/**`.
- Ignores `dist/` and `coverage/`. No environment globals: add `globals.node` or `globals.browser`
  yourself when you need them.

**`react`** (`.js`, `.jsx`, `.mjs`, `.ts`, `.tsx`, `.mts`)

- Browser globals and JSX parsing.
- `eslint-plugin-react-hooks` latest recommended config, with the React Compiler rules
  `set-state-in-effect`, `refs`, `immutability` and `preserve-manual-memoization` as warnings.
- `eslint-plugin-jsx-a11y` recommended config.

**`react-app`** (same files as `react`)

- `react-refresh/only-export-components` as a warning, constants allowed. Meant for Vite apps: in a
  library, a context module that exports a provider and its hooks would warn for no gain.

**`ts`** (`.ts`, `.tsx`, `.mts`, `.cts`)

- `typescript-eslint` strict config.
- `no-unused-vars` and `no-use-before-define` replaced by their `@typescript-eslint` versions with the
  same options.

## Extend

Anything specific to a project goes after the presets:

```js
export default [
    ...base,
    ...react,
    { ignores: ['public/**'] },
    { languageOptions: { globals: { __APP_VERSION__: 'readonly' } } },
    {
        settings: { 'jsx-a11y': { components: { Checkbox: 'input' } } },
    },
    {
        files: ['**/useMapDrawing.js'],
        rules: { 'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }] },
    },
];
```

## Versioning

Turning a warning into an error, adding a rule or tightening an option breaks your lint, so it ships
as a major version.

## License

MIT
