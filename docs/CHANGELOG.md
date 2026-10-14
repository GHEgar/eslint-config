# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

## [0.4.0] - 2026-10-14

### Cambiado

- El paquete se llama `@npmegar/eslint-config`: el scope `@ghegar` de npm pertenece a otra cuenta.
  Los imports pasan de `@ghegar/eslint-config/<preset>` a `@npmegar/eslint-config/<preset>`, y los
  nombres de los bloques de config, de `@ghegar/...` a `@npmegar/...`. Es la primera versión
  publicada en npm.

## [0.3.0] - 2026-10-14

### Cambiado

- `base` ignora `test-results/` y `playwright-report/` en cualquier nivel, además de `dist/` y
  `coverage/`. ESLint no lee `.gitignore` y esas carpetas, con perfiles de Chrome o reportes de
  Playwright, se linteaban enteras.

## [0.2.0] - 2026-10-13

### Agregado

- Preset `react-app` con `react-refresh/only-export-components`, para apps con Vite.

### Cambiado

- `react` ya no incluye `react-refresh`: en librerías daba warnings sin sentido (un `context.tsx` que
  exporta provider y hooks, un `main.tsx` de demo). Las apps agregan `react-app` después de `react`.

## [0.1.0] - 2026-10-13

### Agregado

- Preset `base`: `js.configs.recommended`; 4 espacios con `case` indentado, comillas simples, punto y
  coma y `template-curly-spacing` vía `@stylistic`; `max-lines` de 300 sin blancos ni comentarios;
  `no-unused-vars` con `^[A-Z_]` y `^_`; `no-use-before-define` en el mismo ámbito; `no-console`
  salvo `warn` y `error`; globals de Node y Vitest en archivos de prueba.
- Preset `react`: `react-hooks` (recomendado más reciente, reglas del compilador en warn), `jsx-a11y`
  recomendado y `react-refresh/only-export-components`, con globals del navegador.
- Preset `ts`: `typescript-eslint` estricto en `.ts`/`.tsx`, con `no-unused-vars` y
  `no-use-before-define` cambiadas por sus versiones de `@typescript-eslint`.
