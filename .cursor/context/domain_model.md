# Domain Model — Starbook (base v0)

Documento base del modelo de dominio para Ignition.  
Se irá refinando durante el desarrollo con decisiones técnicas concretas.

---

## 1) Entidades principales

| Entidad | Descripción | Identidad sugerida |
| --- | --- | --- |
| `Uiverse` | Catálogo navegable de documentación de componentes | `basePath` |
| `Constellation` | Agrupación funcional/path de Stars (ej. `components/forms/main`) | `canonicalPath` |
| `Star` | Unidad de documentación de un componente Astro | `slug` + `sourceFile` |
| `Phase` | Variante/estado renderizable de una Star | `slug` dentro de `star` |
| `WormholeBinding` | Registro de datos inyectados por alias | `importName` |

---

## 2) Relaciones

- Un `Uiverse` contiene muchas `Constellation`.
- Una `Constellation` contiene muchas `Star`.
- Una `Star` contiene una o más `Phase`.
- Una `Star` puede tener cero o un documento narrativo `star.mdx`.
- Una `Phase` puede consumir cero o más `WormholeBinding` de forma indirecta (vía imports interceptados).

---

## 3) Invariantes de dominio (MVP)

- Cada `Star` debe declarar `component`, `constellation` y `title` en su `default export`.
- Cada `Star` debe tener al menos una `Phase` exportada.
- Cada `Phase` tiene nombre único dentro de su `Star`.
- Constellation se identifica por `canonicalPath` normalizado (no case-sensitive, segmentos con `/`).
- Los slugs de Star/Phase deben ser estables para URLs.
- `WormholeBinding.importName` debe ser único en su scope efectivo para evitar colisiones.
- Si un Wormhole no resuelve dato, el sistema responde con `undefined` y warning en dev.

---

## 4) Contratos TypeScript de referencia (borrador)

```ts
export type JsonLike =
  | string
  | number
  | boolean
  | null
  | JsonLike[]
  | { [key: string]: JsonLike }

export interface StarMeta {
  component: unknown // Astro component type (a precisar en implementación)
  constellation: string
  title: string
}

export interface Phase {
  args?: Record<string, unknown>
}

export interface StarModule {
  default: StarMeta
  phases: Record<string, Phase>
  mdxPath?: string
}

export interface WormholeBinding<T = unknown> {
  importName: string
  payload: T
  options?: Record<string, unknown>
}
```

---

## 5) Vistas derivadas necesarias para el producto

- `CatalogTree`: estructura jerárquica para sidebar y navegación (implementada vía `StarCatalog` del builder).
- `PhaseRenderModel`: metadatos y args de la Phase activa para render (parcialmente cubierto en UI: se muestran en detalle; falta componer con el componente Astro — I3).
- `RouteState`: en modo ruta inyectada, la resolución equivalente está en **`resolveUiversePath(catalog, param)`** (`packages/starbook`, módulo `uiverse-path`). Modo embebido con query params: pendiente de alinear cuando exista `<Uiverse/>`.

---

## 6) Decisiones pendientes para iteraciones siguientes

- Tipado exacto de `component` para Astro (contrato interno final).
- Inferencia de `constellation` desde el folder del star file.
- Modelo de subconstellations en UI (árbol navegable por segmentos).
- Scope formal de Wormhole (global vs por Star) y precedencia.
- Estrategia de serialización entre SSR y cliente.
