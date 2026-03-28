# MVP Ignition — Alcance base (v0.1)

Documento base de alcance para el MVP de Starbook.  
Se ajustará incrementalmente durante implementación.

---

## 1) Objetivo del MVP

Habilitar a un **autor de componentes** para documentar componentes Astro con Stars y Phases navegables en Uiverse, con soporte SSR para datos reales vía Wormhole.

---

## 2) Incluye (in-scope)

- Integración Astro con ruta inyectada por defecto (`/uiverse`).
- Detección de `*.star.ts` en el proyecto host.
- Render de catálogo por Constellation > Star > Phase.
- Normalización de `constellation` como path lógico (no case-sensitive, separador `/`).
- Render de Phases estáticas usando `args`.
- Soporte opcional de `*.star.mdx` para narrativa.
- Wormhole SSR vía virtual modules.
- Modo dev por defecto (no producción salvo opt-in).

---

## 3) Excluye (out-of-scope)

- Props controls interactivos e inferencia avanzada de tipos.
- Soporte de funciones en cliente a través de Wormhole.
- Detección de stars en paquetes npm externos.
- Ecosistema de addons/satellites.
- Hardening de producción más allá del opt-in básico.

---

## 4) Criterios de aceptación globales

- Un componente con `*.star.ts` válido aparece en `/uiverse`.
- Una Star con múltiples Phases permite navegación por URL.
- Cada Phase renderiza los `args` definidos (objetivo MVP; **pendiente de pipeline de render en core** — hoy el detalle en Uiverse puede mostrar `args` sin montar aún el componente documentado).
- Colisiones de slug (star/phase) se resuelven con sufijos y warning en dev.
- `*.star.mdx` enriquece documentación cuando está presente.
- Wormhole SSR permite usar datos reales con import alias.
- Si no hay Wormhole válido, existe fallback controlado en dev.
- Por defecto, Uiverse no se incluye en build de producción (**criterio objetivo**; el flag `includeInBuild` y el exclude efectivo en build están pendientes — ver incremento 6 —; hoy las rutas se generan en `astro build` si la integración está activa).

---

## 5) No funcionales mínimos

- DX: setup en pocos pasos y sin configuración obligatoria.
- Feedback de errores de star files claro en entorno dev.
- Iteración rápida en dev (watch/reload razonable).

---

## 6) Señales de "MVP alcanzado"

- Los journeys J1-J4 del autor se completan en `apps/workshop`.
- Los journeys secundarios J5-J6 se validan en pruebas manuales.
- Existe documentación base suficiente para onboarding técnico.
