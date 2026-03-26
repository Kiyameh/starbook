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
  constellation: 'Forms',
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
| `constellation` | `string` | Sí | Grupo funcional en Uiverse |
| `title` | `string` | Sí | Nombre visible de la Star |

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
- Colisión de nombres de Phase -> Star inválida.

En Ignition, los errores deben mostrarse de forma clara en dev (log + señal en UI, a precisar).

---

## 6) Aspectos fuera de alcance en v0

- Controls interactivos con inferencia de tipos.
- Esquema extendido de metadatos avanzado.
- Compatibilidad completa con stars externas en paquetes npm.
