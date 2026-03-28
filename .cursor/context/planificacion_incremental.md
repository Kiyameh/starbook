# Planificación incremental — de core a MVP

Plan de ejecución progresiva para construir Starbook sin bloquearse por decisiones adelantadas.  
Principio: entregar valor temprano, validar, y decidir detalles durante el desarrollo.

---

## 1) Estrategia general

- Trabajar por incrementos funcionales pequeños y verificables.
- Priorizar el journey del **autor de componentes**.
- Mantener decisiones abiertas documentadas al final de cada incremento.
- Consolidar criterios de aceptación antes de pasar al siguiente incremento.

---

## 2) Incrementos propuestos (hasta MVP)

## Incremento 0 — Base operativa

**Objetivo:** dejar listo el terreno de trabajo.

**Entregables**
- Estructura mínima del paquete `packages/starbook`.
- Punto de entrada de integración Astro.
- App `apps/workshop` operativa para validar cambios.

**Validación**
- `astro dev` inicia en workshop sin errores.
- Se puede cargar una ruta placeholder de Uiverse.

---

## Incremento 1 — Scanner y modelo de catálogo

**Objetivo:** detectar `*.star.ts` y construir catálogo interno.

**Entregables**
- Scanner de star files.
- Parser mínimo de `default` + exports de Phase.
- Modelo de catálogo (Constellation/Star/Phase) en memoria.

**Decisiones a tomar durante desarrollo**
- Técnica de parsing (AST vs import dinámico controlado).
- Normalización de slugs y colisiones.

**Decisiones tomadas (sesión 26 mar 2026)**
- Parsing adoptado: **AST** con TypeScript compiler API.
- `constellation` normalizada como path lógico no case-sensitive (segmentos `/`).
- Constellations se agrupan por clave canónica; stars/phases colisionadas se resuelven con sufijos y warning.

**Validación**
- Dado un set de stars de prueba, se genera árbol consistente.

---

## Incremento 2 — Uiverse navegable (ruta inyectada)

**Objetivo:** navegar catálogo y abrir una Phase por URL real.

**Entregables**
- Ruta `/uiverse` inyectada por integración.
- Sidebar o lista de navegación por Constellation > Star > Phase.
- Resolución de ruta `/uiverse/<constellation>/<star>/<phase>`.

**Decisiones a tomar durante desarrollo**
- Estructura interna del router del Uiverse.
- Manejo de rutas inválidas.

**Validación**
- Se puede abrir cualquier Phase detectada mediante URL directa.

---

## Incremento 3 — Render de Phases con args (core del autor)

**Objetivo:** renderizar correctamente componentes desde `args` estáticos.

**Entregables**
- Pipeline de render de Star + Phase activa.
- Soporte estable de `args` como fuente de props.
- Manejo de errores visibles en dev cuando la Star es inválida.

**Decisiones a tomar durante desarrollo**
- Cómo vincular `component` + `args` en runtime Astro.
- Estrategia de mensajes de error (UI + consola).

**Validación**
- Journeys J1 y J2 completos en workshop.

---

## Incremento 4 — Soporte `.star.mdx` (enriquecimiento)

**Objetivo:** habilitar documentación narrativa opcional.

**Entregables**
- Detección y carga de `*.star.mdx`.
- Render combinado o priorizado de contenido narrativo.

**Decisiones a tomar durante desarrollo**
- Prioridad de visualización entre vista estructurada y MDX.
- Contrato mínimo de frontmatter.

**Validación**
- Journey J3 completo con y sin `*.star.mdx`.

---

## Incremento 5 — Wormhole SSR

**Objetivo:** usar datos reales del proyecto en stars del autor.

**Entregables**
- API `wormhole(...)` funcional en SSR.
- Registro/resolución por virtual modules.
- Fallback controlado (`undefined` + warning).

**Decisiones a tomar durante desarrollo**
- Scope de registro y limpieza por request/dev cycle.
- Trazabilidad mínima para debug.

**Validación**
- Journey J4 completo en workshop.

---

## Incremento 6 — Endurecimiento MVP y cierre

**Objetivo:** cerrar alcance Ignition con calidad suficiente.

**Entregables**
- Opción `includeInBuild` respetada.
- Checklist de aceptación global ejecutado.
- Documentación técnica actualizada con decisiones finales tomadas.

**Validación**
- Journeys J1-J6 verificados manualmente.
- Criterios de `mvp_ignition.md` marcados como cumplidos.

---

## 3) Priorización de implementación (resumen)

1. Scanner + catálogo.
2. Navegación por ruta inyectada.
3. Render de Phase con args.
4. MDX opcional.
5. Wormhole SSR.
6. Cierre de MVP (DX, errores, opt-in build).

---

## 4) Definición de terminado por incremento

Un incremento se considera terminado cuando:
- Cumple su validación funcional definida.
- No rompe journeys ya cerrados.
- Deja registradas decisiones tomadas y pendientes.
- Permite avanzar al siguiente incremento sin bloqueos estructurales.
