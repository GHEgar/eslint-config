# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

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
