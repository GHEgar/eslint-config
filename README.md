# <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/icon-dark.svg"><img src=".github/assets/icon-light.svg" width="36" height="36" alt=""></picture> eslint-config

[![npm](https://img.shields.io/npm/v/@ghegar/eslint-config)](https://www.npmjs.com/package/@ghegar/eslint-config)
[![license](https://img.shields.io/github/license/GHEgar/eslint-config)](LICENSE)

Shared ESLint flat config: 4 spaces, single quotes, semicolons, 300-line files, with React and TypeScript presets.

One place for the rules that used to be copied by hand from repo to repo: 4-space indent, single
quotes, semicolons and files capped at 300 lines of code. Four presets that compose: `base`, `react`,
`react-app` and `ts`. Each one is a plain array of flat config objects.

## Install

```bash
npm install -D @ghegar/eslint-config eslint
```

Add the peer dependencies of the presets you use:

| Entry | What it adds | Needs |
|---|---|---|
| `@ghegar/eslint-config` | `base`: recommended rules, formatting, `max-lines`, test globals | `eslint` |
| `@ghegar/eslint-config/react` | Browser globals, JSX, React Hooks and accessibility rules | `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` |
| `@ghegar/eslint-config/react-app` | React Refresh rule for Vite apps | `eslint-plugin-react-refresh` |
| `@ghegar/eslint-config/ts` | `typescript-eslint` strict rules | `typescript-eslint`, `typescript` |

```bash
npm install -D eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-react-refresh typescript-eslint typescript
```

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

## Quick start

`eslint.config.js`:

```js
import base from '@ghegar/eslint-config';

export default [
    ...base,
];
```

```bash
npx eslint .
```

## Composing presets

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

## Extending

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

## base

- `@eslint/js` recommended rules.
- `@stylistic/indent` 4 with `SwitchCase: 1`, `@stylistic/quotes` single (escapes and template
  literals allowed), `@stylistic/semi` always, `@stylistic/template-curly-spacing` never.
- `max-lines`: 300, blank lines and comments not counted.
- `no-unused-vars`: ignores `^[A-Z_]` variables and `^_` arguments and destructured elements.
- `no-use-before-define`: same-scope references only, so closures over later declarations pass.
- `no-console`: only `console.warn` and `console.error`.
- Node and Vitest globals for `**/*.test.*`, `**/test/**` and `**/tests/**`.
- Ignores `dist/`, `coverage/`, and `test-results/` and `playwright-report/` at any depth.

## react

Applies to `.js`, `.jsx`, `.mjs`, `.ts`, `.tsx` and `.mts`.

- Browser globals and JSX parsing.
- `eslint-plugin-react-hooks` latest recommended config, with the React Compiler rules
  `set-state-in-effect`, `refs`, `immutability` and `preserve-manual-memoization` as warnings.
- `eslint-plugin-jsx-a11y` recommended config.

## react-app

Applies to the same files as `react`.

- `react-refresh/only-export-components` as a warning, constants allowed. Meant for Vite apps: in a
  library, a context module that exports a provider and its hooks would warn for no gain.

## ts

Applies to `.ts`, `.tsx`, `.mts` and `.cts`.

- `typescript-eslint` strict config.
- `no-unused-vars` and `no-use-before-define` replaced by their `@typescript-eslint` versions with the
  same options.

## Known limitations

- `base` has no environment globals: add `globals.node` or `globals.browser` yourself when you need
  them. Without them, `console` reports `no-undef`.
- `eslint-plugin-jsx-a11y` needs the `overrides` entry above until it lists ESLint 10 as a peer.

## Development

```bash
npm test
npm run lint
npm run pack
```

The tests lint inline code with the composed presets through the ESLint Node API. `npm run lint`
lints the repo with its own `base`, and `npm run pack` writes a tarball to `dist/`.

## Contributing

Issues are welcome. Open one before sending a pull request.

## License

MIT © GHEgar
