# Retomar sesión de conceptualización

Documento de continuidad. Registra el estado exacto de la conceptualización en curso para poder retomar el flujo sin perder contexto. Actualizar al final de cada sesión de trabajo.

**Última actualización:** 26 mar 2026

---

## Estado actual

La conceptualización del Paso 0 está **completa y cerrada**.  
La decisión bloqueante de Iteración 1 ya fue resuelta: el usuario principal del MVP Ignition es el **Autor de componentes**.  
Además, ya existe `user_journeys.md` con los flujos y criterios de aceptación iniciales.
Se adoptó una estrategia **incremental**: generar documentos base y refinar decisiones durante la implementación.

---

## Próximo paso pendiente

### Arranque de ejecución incremental

Con los documentos base ya creados, el siguiente paso es iniciar el **Incremento 0** de desarrollo según `planificacion_incremental.md`.

Decisión registrada para Ignition:

- **Principal:** Autor de componentes.
- **Secundarios:** Consumidor del catálogo e Integrador.
- **Implicación:** el MVP prioriza authoring (`.star.ts`, Phases, Wormhole SSR) sin descuidar navegación básica ni setup de integración.

**Acción al inicio de la próxima sesión:** comenzar Incremento 0 (base operativa).

---

## Documentos de contexto disponibles

Documentos creados en versión base:

| # | Archivo | Contenido | Depende de |
| --- | --- | --- | --- |
| 1 | `conceptualizacion.md` | Decisiones de producto y marco conceptual | — |
| 2 | `user_journeys.md` | Flujos E2E y aceptación por actor | `conceptualizacion.md` |
| 3 | `domain_model.md` | Entidades, invariantes y tipos base | `user_journeys.md` |
| 4 | `arquitectura_monorepo.md` | Relación de workspaces y contratos internos | `domain_model.md` |
| 5 | `formato_star.md` | Spec base de `.star.ts` y `.star.mdx` | `domain_model.md` |
| 6 | `wormhole.md` | Contrato base y límites técnicos | `formato_star.md` |
| 7 | `mvp_ignition.md` | Scope y criterios globales de v0.1 | Todos los anteriores |
| 8 | `planificacion_incremental.md` | Roadmap incremental desde core hasta MVP | Todos los anteriores |

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
2. Revisar `planificacion_incremental.md` y confirmar orden de incrementos.
3. Ejecutar Incremento 0 y registrar decisiones tomadas.
