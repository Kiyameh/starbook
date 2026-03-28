# Formato Star — Especificación base (v0)

Documento base del contrato de authoring para Ignition.  
Define estructura mínima válida de `*.star.ts` y rol de `*.star.mdx`.

---

## 1) Objetivo del formato

- Permitir documentar componentes Astro con fricción mínima.
- Representar variantes explícitas por medio de Phases.
- Mantener compatibilidad conceptual con CSF 3.0.

---

## 2) Archivo obligatorio: `Component.star.ts`

### Reglas base

- Debe estar junto al componente documentado (colocación recomendada).
- Debe exportar `default` con metadatos del componente.
- Debe exportar una o más Phases nombradas.

### Contrato mínimo

```ts
import Component from './Component.astro'

export default {
  component: Component,
  constellation: 'components/forms/main',
  title: 'Component',
}

export const Default = {
  args: {},
}
```

### Campos del `default export`

| Campo | Tipo base | Requerido | Notas |
| --- | --- | --- | --- |
| `component` | `Astro component` | Sí | Referencia al componente documentado |
| `constellation` | `string` | Sí | Path lógico de agrupación en Uiverse |
| `title` | `string` | Sí | Nombre visible de la Star |

### Convención vigente para `constellation` (Ignition)

`constellation` se interpreta como un **path lógico** (similar a carpetas), por ejemplo:

- `components/forms/main`
- `content/blog/cards`

Reglas de normalización aplicadas por Starbook:

1. **No case-sensitive**: `Components/Forms/Main` y `components/forms/main` se consideran la misma constellation.
2. **Separador jerárquico**: `/` define segmentos de subconstellation.
3. **Slug por segmento**: cada segmento se normaliza a kebab-case.
4. **Clave canónica**: la identidad interna de Constellation es la ruta normalizada completa (ej. `components/forms/main`).
5. **Agrupación por clave canónica**: variaciones de escritura se agrupan y generan warning en dev.

Ejemplos:

- `Forms` -> `forms`
- `Forms!` -> `forms`
- `/Components/Brand/Main/` -> `components/brand/main`

---

## 3) Phases (exports nombrados)

- Cada export nombrado representa una `Phase`.
- La propiedad inicial soportada en Ignition es `args`.
- Los nombres de Phase deben ser únicos por archivo.

Ejemplo:

```ts
export const Default = { args: { label: 'Save' } }
export const Disabled = { args: { label: 'Save', disabled: true } }
```

---

## 4) Archivo opcional: `Component.star.mdx`

- Añade documentación narrativa y ejemplos embebidos.
- No reemplaza el `.star.ts`; lo complementa.
- Si existe, Uiverse puede priorizar vista enriquecida del componente.

---

## 5) Errores y validaciones (base)

- Falta `default export` -> Star inválida.
- Falta alguna propiedad obligatoria (`component`, `constellation`, `title`) -> Star inválida.
- Sin Phases exportadas -> Star inválida.
- Colisión de slug de Phase -> warning y resolución con sufijo (`-2`, `-3`, ...).
- Colisión de slug de Star dentro de la misma Constellation -> warning y resolución con sufijo.
- Variantes de `constellation` que normalizan a la misma clave -> se agrupan y generan warning.

En Ignition, los errores deben mostrarse de forma clara en dev (log + señal en UI, a precisar).

---

## 6) Aspectos fuera de alcance en v0

- Controls interactivos con inferencia de tipos.
- Esquema extendido de metadatos avanzado.
- Compatibilidad completa con stars externas en paquetes npm.

---

## 7) Insights (futuro)

Sección para registrar ideas futuras sin bloquear la implementación actual.

### 7.1 Inferencia automática de Constellation

Idea: permitir que Starbook infiera `constellation` desde el path del archivo `*.star.ts` cuando no esté definido explícitamente.

Propuesta de prioridad:

1. `constellation` explícita en `.star.ts`.
2. Constellation inferida por carpeta.
3. Fallback: `uncategorized`.

### 7.2 Subconstellations como estructura nativa

Idea: tratar segmentos `/` como jerarquía real en navegación/UI.

Ejemplo:

- `components/brand/main`
  - nivel 1: `components`
  - nivel 2: `brand`
  - nivel 3: `main`

Objetivo: habilitar navegación por grupos anidados sin romper el contrato actual de `constellation` como string.
