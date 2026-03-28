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
4. Se inyecta la ruta `/uiverse` (o se monta `<Uiverse/>` embebido).
5. Uiverse renderiza la Phase seleccionada usando `args`.
6. Si hay Wormholes, se resuelven vía virtual modules en SSR.

---

## 4) Contratos entre módulos (borrador)

- `scanner` -> produce lista normalizada de `StarModule`.
- `catalog-builder` -> transforma módulos en árbol navegable y resuelve normalización/colisiones.
- `router-adapter` -> traduce URL/query en `RouteState`.
- `renderer` -> recibe `PhaseRenderModel` y compone vista.
- `wormhole-registry` -> registra y resuelve bindings por alias.

---

## 5) Build y distribución (objetivo Ignition)

- Paquete npm principal: `starbook`.
- Modo por defecto: activo en desarrollo, excluido de producción.
- Opción de publicación de catálogo: `includeInBuild: true` (opt-in).

---

## 6) Riesgos/decisiones abiertas

- Balance entre simplicidad del scanner y robustez del parsing.
- Estrategia de caché/invalidación en dev para cambios de star files.
- Frontera entre runtime server y cliente para futuras features (Orbit).
