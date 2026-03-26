# User Journeys — Starbook (Ignition v0.1)

Documento de flujos end-to-end para el MVP Ignition. Define actores, objetivos, recorridos y criterios de aceptación.  
Decisión de producto vigente: **usuario principal = Autor de componentes**.

---

## 1) Actores y peso en el MVP

| Actor | Peso en Ignition | Objetivo principal |
| --- | --- | --- |
| **Autor de componentes** | **Primario** | Documentar sus componentes Astro con Stars y Phases en el menor tiempo posible |
| Consumidor del catálogo (dev/diseño/QA) | Secundario | Navegar y validar estados documentados |
| Integrador (dev host) | Secundario (de entrada) | Activar Starbook en un proyecto Astro sin fricción |

---

## 2) Journey principal — Autor de componentes

### J1 — Crear la primera Star de un componente

**Objetivo:** el autor convierte un componente existente en una Star navegable dentro de Uiverse.

**Precondiciones**
- Proyecto Astro con Starbook instalado.
- Modo dev activo.
- Existe un componente, por ejemplo `Button.astro`.

**Flujo**
1. El autor crea `Button.star.ts` junto a `Button.astro`.
2. Define `export default` con `component`, `constellation` y `title`.
3. Declara una primera `Phase` (por ejemplo `Default`) con `args`.
4. Abre `/uiverse`.
5. Encuentra la Star en la Constellation indicada.
6. Abre la Phase y valida que renderiza correctamente.

**Resultado esperado**
- La Star aparece en el catálogo y su primera Phase se visualiza sin configuración adicional.

**Criterios de aceptación (Ignition)**
- Si existe `*.star.ts` válido, la Star se detecta en dev.
- La URL de detalle sigue el patrón `/uiverse/<constellation>/<star>/<phase>`.
- El render usa los `args` de la Phase definida.

---

### J2 — Añadir variantes (Phases) para cubrir estados clave

**Objetivo:** documentar estados relevantes de un componente sin controles interactivos.

**Precondiciones**
- Star inicial creada y visible en Uiverse.

**Flujo**
1. El autor añade nuevas Phases (`Disabled`, `WithIcon`, etc.) en el mismo `.star.ts`.
2. Guarda cambios y recarga/actualiza Uiverse.
3. Navega entre Phases para revisar diferencias visuales y de props.

**Resultado esperado**
- Cada estado importante del componente queda representado por una Phase explícita.

**Criterios de aceptación (Ignition)**
- Las Phases exportadas se listan y son navegables.
- Cada Phase renderiza los `args` exactos declarados.
- El sistema no depende de controles runtime para cambiar props.

---

### J3 — Enriquecer documentación con `.star.mdx` (opcional)

**Objetivo:** complementar la documentación técnica con narrativa y ejemplos.

**Precondiciones**
- Existe `*.star.ts` del componente.

**Flujo**
1. El autor crea `Button.star.mdx`.
2. Añade contexto de uso, notas y ejemplos de render.
3. Abre la entrada del componente en Uiverse y valida el contenido enriquecido.

**Resultado esperado**
- La documentación del componente combina estructura (Phases) y narrativa (MDX).

**Criterios de aceptación (Ignition)**
- Con `.star.mdx` presente, Uiverse muestra documentación enriquecida.
- Sin `.star.mdx`, Uiverse mantiene vista estructurada por defecto.

---

### J4 — Usar Wormhole SSR para datos reales

**Objetivo:** evitar mocks manuales cuando la Star necesita datos del proyecto.

**Precondiciones**
- La Star necesita datos de colecciones/fuentes del host.

**Flujo**
1. El autor obtiene datos reales en contexto SSR.
2. Registra un Wormhole con `wormhole(itemToTranspass, options?, importName)`.
3. El componente consume el alias importado (`import data from 'my-products'`).
4. El autor valida la renderización en Uiverse.

**Resultado esperado**
- La Star se renderiza con datos reales del proyecto en dev SSR.

**Criterios de aceptación (Ignition)**
- Wormhole funciona en SSR vía virtual modules.
- Si no hay dato disponible, se recibe `undefined` con warning en dev.
- No se soportan funciones en cliente dentro del alcance del MVP.

---

## 3) Journeys secundarios

### J5 — Consumidor navega el catálogo para validar estados

**Objetivo:** revisar rápidamente variantes ya documentadas por el autor.

**Flujo breve**
1. Entra a `/uiverse`.
2. Navega por Constellations, Stars y Phases.
3. Verifica visualmente estados y comportamiento esperado.

**Criterios de aceptación (Ignition)**
- Navegación clara por árbol Constellation > Star > Phase.
- URLs compartibles por estado en modo ruta inyectada.

---

### J6 — Integrador activa Starbook en un proyecto Astro

**Objetivo:** habilitar Uiverse con configuración mínima.

**Flujo breve**
1. Instala Starbook.
2. Añade la integración en `astro.config`.
3. Inicia dev y accede a `/uiverse`.

**Criterios de aceptación (Ignition)**
- Integración funcional con configuración por defecto.
- Uiverse solo en dev por defecto (`includeInBuild: false`).

---

## 4) Límites explícitos del MVP Ignition

- Props controls interactivos: fuera de alcance (vendrá en Orbit).
- Wormhole de cliente para funciones: fuera de alcance.
- Detección de stars en paquetes npm externos: fuera de alcance.

---

## 5) Checklist de validación transversal

- [ ] Un autor puede documentar un componente con solo `*.star.ts`.
- [ ] Puede añadir múltiples Phases estáticas y navegarlas por URL.
- [ ] Puede usar `.star.mdx` para narrativa opcional.
- [ ] Puede inyectar datos SSR con Wormhole para casos reales.
- [ ] Un consumidor puede revisar estados sin conocer implementación interna.
- [ ] Un integrador puede activar Starbook sin setup complejo.
