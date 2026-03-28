# Retomar sesión de conceptualización

Documento de continuidad. Registra el estado exacto de la conceptualización e implementación para retomar sin perder contexto. Actualizar al final de cada sesión de trabajo.

**Última actualización:** 26 mar 2026

---

## Estado actual

La base de conceptualización está cerrada y la ejecución incremental ya arrancó.

- Incremento 0: **completado**.
- Incremento 1: **muy avanzado**.

Implementado en Incremento 1:

- Scanner de `*.star.ts`.
- Parser AST (`default` + Phases con `args` literales).
- Catálogo interno en memoria (`Constellation > Star > Phase`).
- Diagnósticos no fatales (errores/warnings).
- Normalización de `constellation` como path lógico no case-sensitive.

Decisiones técnicas cerradas en esta sesión:

- Parsing: AST con TypeScript compiler API.
- Constellation: identidad por ruta canónica normalizada (segmentos con `/`).
- Colisiones de star/phase: warning + sufijo incremental (`-2`, `-3`, ...).

---

## Próximo paso pendiente

### Cierre formal de Incremento 1

Pendientes para dejar I1 al 100%:

1. Añadir tests automatizados mínimos para scanner/parser/builder.
2. Afinar presentación DX de diagnósticos en la vista de prueba.
3. Verificar checklist de terminado del incremento y registrar decisiones finales.

### Paso siguiente

Tras cerrar I1, iniciar Incremento 2 (navegación real de Uiverse por ruta inyectada).

---

## Documentos de contexto disponibles

| # | Archivo | Contenido | Depende de |
| --- | --- | --- | --- |
| 1 | `conceptualizacion.md` | Decisiones de producto y marco conceptual | — |
| 2 | `user_journeys.md` | Flujos E2E y aceptación por actor | `conceptualizacion.md` |
| 3 | `domain_model.md` | Entidades, invariantes y tipos base | `user_journeys.md` |
| 4 | `arquitectura_monorepo.md` | Relación de workspaces y contratos internos | `domain_model.md` |
| 5 | `formato_star.md` | Spec de `.star.ts`/`.star.mdx` + convenciones vigentes + insights | `domain_model.md` |
| 6 | `wormhole.md` | Contrato base y límites técnicos | `formato_star.md` |
| 7 | `mvp_ignition.md` | Scope y criterios globales de v0.1 | Todos los anteriores |
| 8 | `planificacion_incremental.md` | Roadmap incremental desde core hasta MVP | Todos los anteriores |

---

## Resumen del flujo de conceptualización acordado

1. **Paso 0 — Conceptualización base** — completado
2. **Iteración 1 — User Journeys** — completado
3. **Iteración 2 — Modelo de dominio** — completado (base)
4. **Iteración 3 — Arquitectura y contratos** — completado (base)
5. **Iteración 4 — Formato de authoring** — completado (base + actualización I1)
6. **Iteración 5 — MVP Ignition** — completado (base)

---

## Contexto clave para retomar sin leer todo el chat

- Monorepo con `pnpm` + `Turbo`, core en `packages/starbook`, app de pruebas en `apps/workshop`.
- Léxico oficial: **Uiverse**, **Constellation**, **Star**, **Phase**, **Wormhole**.
- Formato de authoring: `.star.ts` obligatorio y `.star.mdx` opcional.
- `constellation` ahora se modela como path lógico (`segment/segment`) no case-sensitive.
- La navegación objetivo de ruta inyectada usa `/uiverse/<constellation-path>/<star>/<phase>`.
- Wormhole MVP: SSR via virtual modules; cliente solo serializable; funciones en cliente fuera de scope.

---

## Cómo empezar la próxima sesión

1. Leer este archivo.
2. Cerrar pendientes de Incremento 1.
3. Confirmar checklist de terminado.
4. Arrancar Incremento 2.
