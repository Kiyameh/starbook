# Arquitectura Monorepo — Starbook (base v0)

Documento base de arquitectura para guiar implementación incremental hasta MVP Ignition.

---

## 1) Estructura actual

```text
starbook/
├── packages/
│   └── starbook/      # core distribuible (integration + Uiverse component + APIs)
├── apps/
│   ├── workshop/      # app Astro para desarrollo manual y pruebas end-to-end
│   └── docs/          # documentación oficial del proyecto
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 2) Responsabilidades por workspace

- `packages/starbook`
  - Detección/carga de `*.star.ts` (y opcionalmente `*.star.mdx`).
  - Integration de Astro (`injectRoute`, opciones base).
  - Render de Uiverse y navegación.
  - API `wormhole(...)` para SSR en dev.
- `apps/workshop`
  - Banco de prueba de componentes reales.
  - Verificación manual de journeys del autor.
- `apps/docs`
  - Documentación para usuarios de Starbook.

---

## 3) Flujo base de ejecución (dev)

1. Proyecto host inicia `astro dev` con integración de Starbook.
2. Starbook escanea los star files.
3. Se construye un catálogo interno (Constellation/Star/Phase) normalizando `constellation` como path lógico.
4. Se inyectan rutas bajo la base configurada (p. ej. índice `/uiverse`, detalle `[...uiverse]`, `/uiverse/debug`; ver integración en `packages/starbook`).
5. Uiverse muestra navegación (sidebar) y, en la Phase seleccionada, metadatos y vista previa de `args` (JSON). El **render del componente Astro con esas props** forma parte del Incremento 3 (aún no cerrado en el core).
6. Cuando exista Wormhole (Incremento 5), se resuelven bindings vía virtual modules en SSR.

---

## 4) Contratos entre módulos (borrador)

- `scanner` → produce rutas de `*.star.ts` listas para parsear (workshop: `scan-star-files`).
- `parser` + `catalog` (`buildCatalog` / `build-catalog-tree`) → árbol Constellation > Star > Phase y diagnósticos.
- `uiverse-path` → construye el segmento de URL por Phase y resuelve `.../constellation…/star/phase` → nodo del catálogo (sustituye buena parte del “router-adapter” hasta que exista un `RouteState` formal).
- Páginas inyectadas (`uiverse-index`, `[...uiverse]`, `debug`) → shell UI + `getStaticPaths` en modo estático del host.
- `renderer` (pendiente I3) → `PhaseRenderModel` + componente + `args` en vista real.
- `wormhole-registry` (pendiente I5) → registra y resuelve bindings por alias.

---

## 5) Build y distribución (objetivo Ignition)

- Paquete npm principal: `starbook`.
- **Objetivo:** activo en desarrollo; excluido del sitio de producción del host salvo opt-in.
- **Estado actual:** la exclusión de rutas en `astro build` no está implementada; `includeInBuild` está planificado (incremento 6).
- Opción prevista de publicación de catálogo: `includeInBuild: true` (opt-in).

---

## 6) Riesgos/decisiones abiertas

- Balance entre simplicidad del scanner y robustez del parsing.
- Estrategia de caché/invalidación en dev para cambios de star files.
- Frontera entre runtime server y cliente para futuras features (Orbit).
