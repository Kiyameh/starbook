# Retomar sesión de conceptualización

Documento de continuidad. Registra el estado exacto de la conceptualización en curso para poder retomar el flujo sin perder contexto. Actualizar al final de cada sesión de trabajo.

**Última actualización:** 25 mar 2026

---

## Estado actual

La conceptualización del Paso 0 está **completa y cerrada**. Todos los aspectos fundamentales del producto están definidos y documentados en `conceptualizacion.md`.

---

## Próximo paso pendiente

### Pregunta sin responder (bloquea los User Journeys)

Antes de escribir los User Journeys necesitamos confirmar quién es el **usuario principal del Uiverse** en la fase Ignition (v0.1). La respuesta condiciona los criterios de aceptación y las prioridades del MVP.

Las opciones no son excluyentes, pero sí tienen pesos distintos en el MVP:

| Opción | Usuario | Qué implica para el MVP |
| --- | --- | --- |
| **A** | **Autor de componentes** — dev que crea las Stars y las Phases, define Wormholes | Ignition se centra en el flujo de authoring y detección de star files |
| **B** | **Consumidor del catálogo** — dev, diseñador o QA que navega el Uiverse | Ignition se centra en la experiencia de navegación y visualización |
| **C** | **Integrador** — dev que añade Starbook a un proyecto Astro existente | Siempre relevante (es el punto de entrada); más ligado a DX que a features |

**Acción al inicio de la próxima sesión:** responder esta pregunta y luego proceder a crear `user_journeys.md`.

---

## Documentos pendientes de crear

Los documentos de contexto que quedan por generar, en orden de dependencia:

| # | Archivo | Contenido | Depende de |
| --- | --- | --- | --- |
| 1 | `user_journeys.md` | Flujos end-to-end del autor y consumidor del Uiverse | Respuesta a "usuario principal" |
| 2 | `domain_model.md` | Entidades, invariantes y tipos TypeScript de referencia | `user_journeys.md` |
| 3 | `arquitectura_monorepo.md` | Relación entre `packages/` y `apps/`, flujo de build | `domain_model.md` |
| 4 | `formato_star.md` | Spec del formato `.star.ts` y `.star.mdx`, ejemplos canónicos | `domain_model.md` |
| 5 | `wormhole.md` | Decisiones y limitaciones técnicas del mecanismo de inyección | `formato_star.md` |
| 6 | `mvp_ignition.md` | Scope exacto de v0.1 con criterios de aceptación verificables | Todos los anteriores |

---

## Resumen del flujo de conceptualización acordado

El flujo sigue este orden de iteraciones (de general a concreto):

1. **Paso 0 — Conceptualización base** — completado → `conceptualizacion.md`
2. **Iteración 1 — User Journeys** ← siguiente
3. **Iteración 2 — Modelo de dominio** (entidades, invariantes, tipos)
4. **Iteración 3 — Arquitectura y contratos** (monorepo, integración Astro, rutas)
5. **Iteración 4 — Formato de authoring** (spec de star files)
6. **Iteración 5 — MVP Ignition** (scope v0.1, criterios de aceptación)

---

## Contexto clave para retomar sin leer todo el chat

- El proyecto es un monorepo (`pnpm` + `Turbo`) con `packages/starbook` como core distribuible y `apps/workshop` + `apps/docs` como entornos auxiliares.
- El léxico oficial es: **Uiverse** (dashboard), **Constellation** (grupo), **Star** (componente), **Phase** (variante), **Wormhole** (inyector de datos).
- El formato de story es **CSF 3.0-inspirado** en `.star.ts` (primario, obligatorio) + `.star.mdx` opcional (documentación narrativa).
- La navegación usa **paths reales** en ruta inyectada (`/uiverse/forms/button/disabled`) y **query params** en el componente `<Uiverse/>` embebido (`?_star=button&_phase=disabled`).
- El Wormhole funciona en MVP solo en **SSR** via virtual modules de Vite; en cliente solo datos serializables; funciones en cliente están fuera del MVP.
- El Uiverse no va a producción por defecto; hay un opt-in (`includeInBuild: true`) para publicarlo.
- El documento completo de decisiones está en `.cursor/context/conceptualizacion.md`.
- El documento de visión original (roadmap, glosario, identidad visual) está en `.cursor/context/starbook.md`.

---

## Cómo empezar la próxima sesión

1. Leer este archivo.
2. Responder: ¿quién es el usuario principal del Uiverse en Ignition — Autor (A), Consumidor (B) o ambos con pesos distintos?
3. Crear `user_journeys.md` con los flujos confirmados.
