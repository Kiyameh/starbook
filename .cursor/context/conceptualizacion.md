# Conceptualización de Starbook

Documento de referencia de producto: decisiones confirmadas, modelo de dominio y scope. **No es spec técnica**; para implementación ver `packages/starbook`. Para el flujo de sesión de trabajo ver `retomar_sesion.md`.

## Índice

1. [Qué es Starbook](#1-qué-es-starbook)
2. [Modelo de dominio](#2-modelo-de-dominio)
3. [Formato de authoring (Star files)](#3-formato-de-authoring-star-files)
4. [Integración con el proyecto host](#4-integración-con-el-proyecto-host)
5. [Modelo de navegación](#5-modelo-de-navegación)
6. [Wormholes](#6-wormholes)
7. [Props controls](#7-props-controls)
8. [Producción y distribución](#8-producción-y-distribución)
9. [Monorepo](#9-monorepo)
10. [Estrategia de desarrollo](#10-estrategia-de-desarrollo)
11. [Decisiones técnicas abiertas](#11-decisiones-técnicas-abiertas)

---

## 1. Qué es Starbook

Starbook es un framework de documentación para proyectos Astro que genera un catálogo navegable de componentes llamado **Uiverse**. Es el equivalente a Storybook para React, pero construido específicamente para la arquitectura de islas y el renderizado en servidor de Astro.

| Principio | Descripción |
| --- | --- |
| SSR-first | El catálogo vive en el servidor; nada se fuerza al cliente sin razón |
| Sin imponer React | El Uiverse y los star files viven en `.ts` / `.astro` / `.mdx` |
| 0 configuración | Se distribuye como integración Astro o paquete npm listo para usar |
| Solo dev por defecto | No se traslada al build de producción salvo opción explícita |

---

## 2. Modelo de dominio

```text
Uiverse
└── Constellation  (grupo funcional/path: "components/forms/main"...)
    └── Star        (componente: Button, Card...)
        └── Phase   (estado/variante: Default, Disabled, Mobile...)
```

| Entidad | Concepto técnico | Descripción |
| --- | --- | --- |
| **Uiverse** | Dashboard / catálogo | Página generada bajo `/uiverse`, solo en dev |
| **Constellation** | Grupo / path lógico | Agrupa Stars del mismo área funcional; no case-sensitive |
| **Star** | Componente documentado | Representa un componente `.astro` con sus variantes |
| **Phase** | Estado / story | Cada variante de la Star con props concretas |
| **Wormhole** | Inyector de datos | Mecanismo para pasar datos reales del proyecto a una Star |

---

## 3. Formato de authoring (Star files)

Máximo **dos archivos por componente**, colocados junto al componente.

### Archivo primario — `Button.star.ts` (obligatorio)

Inspirado en **CSF 3.0** (Component Story Format). Las Phases son exports nombrados:

```ts
import Button from './Button.astro'

export default {
  component: Button,
  constellation: 'components/forms/main',
  title: 'Button',
}

export const Default: Phase = {
  args: { label: 'Click me', variant: 'primary' }
}

export const Disabled: Phase = {
  args: { label: 'Click me', disabled: true }
}
```

Propiedades del export `default`:

| Propiedad | Tipo | Descripción |
| --- | --- | --- |
| `component` | `AstroComponent` | El componente a documentar |
| `constellation` | `string` | Path lógico al que pertenece (ej. `components/forms/main`) |
| `title` | `string` | Nombre mostrado en el Uiverse |

### Archivo secundario — `Button.star.mdx` (opcional)

Documentación narrativa que envuelve y enriquece el `.star.ts`. Permite mezclar prosa y renders del componente:

```mdx
---
title: 'Button'
constellation: 'Forms'
---

import Button from './Button.astro'

# Button

Descripción del componente...

<Button label="Click me" variant="primary" />
```

Si existe solo `.star.ts` → el Uiverse renderiza el catálogo estructurado.
Si existe además `.star.mdx` → el Uiverse muestra la documentación enriquecida.

---

## 4. Integración con el proyecto host

### Modo A — Astro integration (ruta inyectada)

```js
// astro.config.mjs
import starbook from 'starbook'

export default defineConfig({
  integrations: [starbook()]
})
```

Monta `/uiverse` automáticamente mediante `injectRoute`. Solo activo en dev por defecto.

Opciones de configuración previstas:

```js
starbook({
  base: '/uiverse',        // ruta base (default: '/uiverse')
  includeInBuild: false,   // opt-in para publicar el catálogo
})
```

### Modo B — Componente embebido

```astro
---
import { Uiverse } from 'starbook'
---
<Uiverse />
```

Renderiza el catálogo dentro del layout donde se inserta (no fullscreen takeover). Los dos modos **no son exclusivos** y pueden coexistir.

---

## 5. Modelo de navegación

El Uiverse detecta el contexto en que vive y adapta el modelo de navegación:

| Contexto | Modelo | Ejemplo de URL |
| --- | --- | --- |
| Ruta inyectada (`/uiverse`) | Paths reales | `/uiverse/components/forms/main/button/disabled` |
| `<Uiverse/>` embebido | Query params del host | `?_star=button&_phase=disabled` |

Estructura de paths en ruta inyectada:
`/uiverse/<constellation-path>/<star>/<phase>`

---

## 6. Wormholes

Mecanismo para inyectar datos del proyecto real en el contexto de renderizado de una Star, evitando tener que construir mocks manualmente.

### Firma de la función

```ts
wormhole(itemToTranspass, options?, importName)
```

### Uso

```ts
// En el star file o en la config global de Starbook
import { wormhole } from 'starbook'
const products = await getCollection('products')
wormhole(products, {}, 'my-products')

// En el componente .astro (transparente al componente)
import products from 'my-products' // ← Starbook intercepta y devuelve los datos
```

### Alcance y limitaciones por fase

| Contexto | MVP (Ignition) | Futuro |
| --- | --- | --- |
| **SSR (servidor)** | Virtual modules de Vite | Estable |
| **Cliente (islas)** | Solo datos serializables (objetos, arrays) | Explorar API endpoint |
| **Funciones en cliente** | Fuera de scope | Alternativa via API |
| **Fallback** | `undefined` + warning en consola dev | — |
| **Scope** | Por Star o reutilizable entre varias | — |

El componente documentado no necesita saber que existe un Wormhole: la intercepción es transparente vía resolución de módulos de Vite.

---

## 7. Props controls

| Fase | Comportamiento |
| --- | --- |
| **MVP (Ignition)** | Phases estáticas: las props se declaran en `.star.ts` y el Uiverse las renderiza sin interacción |
| **Orbit** | Inferencia automática de tipos TypeScript + panel de controles interactivo (similar a Storybook Controls) |

---

## 8. Producción y distribución

- **Default:** el Uiverse no se incluye en el build de producción.
- **Opt-in:** opción `includeInBuild: true` para publicar el catálogo como sitio de documentación.
- **Distribución:** paquete npm (`starbook`) + Astro integration. Filosofía 0 configuración.

---

## 9. Monorepo

```text
starbook/                     ← raíz del monorepo
├── packages/
│   └── starbook/             ← core distribuible (integration + Uiverse component)
├── apps/
│   ├── workshop/             ← Astro app para desarrollo y pruebas manuales
│   └── docs/                 ← documentación oficial (Astro Starlight)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

Stack del monorepo: `pnpm` + `Turbo` + `TypeScript` + `Astro >=4`

---

## 10. Estrategia de desarrollo

- **IA-asistida**: contexto centralizado en `.cursor/` (rules, skills, context).
- **Testing**: el framework que mejor encaje al problema sin experimentos. Candidatos: Vitest (lógica de paquete), Playwright (dashboard en browser).
- **Revisión humana**: PR review obligatoria antes de fusionar cualquier rama.
- **Iteración incremental** por fases:

| Fase | Versión | Objetivo |
| --- | --- | --- |
| **Ignition** | v0.1 | Uiverse navegable con Stars y Phases estáticas; Wormhole SSR |
| **Orbit** | v0.5 | Props controls interactivos; inferencia de tipos |
| **Deep Space** | v1.0 | Wormhole cliente; Satellites (addons); exportación estática |

---

## 11. Decisiones técnicas abiertas

| Decisión | Cuándo resolver |
| --- | --- |
| Cómo Starbook renderiza el componente con `args` desde `.star.ts` | Diseño técnico Ignition (crítico) |
| Estructura interna del router del Uiverse | Diseño técnico Ignition |
| Detección de `.star.ts` en paquetes npm externos | Post-MVP (Orbit) |
| Wormhole en cliente con funciones | Deep Space o posterior |
| Inferencia automática de tipos para controls | Orbit |
| Inferencia automática de Constellation por carpeta | Post-Ignition |
| Modelo UI de subconstellations (árbol anidado) | Post-Ignition |
| Usuarios principales del Uiverse (pesos por fase) | Pendiente — ver `retomar_sesion.md` |
