---
name: documentar-contexto
description: Genera y mantiene documentación sintetizada del proyecto en .cursor/context/ tras cambios sustanciales de código o cuando se pidan revisiones de la documentación existente. Se usa como agente documentador para seleccionar solo la información realmente relevante y redactarla en español con un formato claro, conciso y estructurado.
disable-model-invocation: true
---

# Documentador de contexto del proyecto

**NUNCA ejecutar automaticamente** Solo ejecutar este skill cuando el usuario lo invoque explícitamente con `/documentar-contexto`

Esta skill define cómo actuar como **agente documentador** del proyecto, manteniendo la carpeta `.cursor/context/` actualizada con documentación de alto nivel, sintetizada y verdaderamente útil.

## Cuándo usar esta skill

Aplica esta skill en estos casos:

- **Tras cambios sustanciales de código**:
  - Nuevas features visibles para el usuario.
  - Refactors que cambian arquitectura, contratos o flujos importantes.
  - Cambios en esquemas, tipos o contenido estructurado del monorepo.
  - Cambios en diseño o UX que afecten a varias páginas o componentes.
- **Cuando el usuario lo pida explícitamente**:
  - "Documenta estos cambios", "actualiza la documentación de contexto", "resúmeme este cambio para contexto".
- **Cuando la documentación existente quede obsoleta**:
  - Se detectan inconsistencias claras entre código actual y archivos en `.cursor/context/`.

Si el cambio es muy pequeño, local y autoexplicativo (p.ej. cambiar un copy puntual, un pequeño ajuste de estilos sin impacto global), **no** generes un nuevo documento; como mucho, actualiza una línea si ya existe un contexto directamente relacionado.

## Principios de documentación

- **Síntesis agresiva**: prioriza la información que:
  - Cambia el modelo mental del proyecto.
  - Afecta flujos de usuario, arquitectura, tipos de dominio o contratos.
  - Es difícil de deducir solo leyendo el código.
- **Relevancia antes que completitud**:
  - Evita copiar descripciones triviales del código.
  - Omite detalles de implementación de bajo nivel salvo que sean decisiones críticas.
- **Formato estable y escaneable**:
  - Usa secciones claras, listas numeradas y bullets.
  - Mantén una voz **neutra, técnica y en español**.
- **Consistencia con el resto de contexto**:
  - Sigue el estilo de documentos existentes en `.cursor/context/` (índices, secciones claras, tono descriptivo).
- **No dupliques información**:
  - Si ya existe un documento que cubre el tema, **actualiza** ese archivo en lugar de crear uno nuevo.

## Tipos de documentos en `.cursor/context/`

Usa o crea archivos en `.cursor/context/` siguiendo estos tipos habituales:

- **Visión y características**: objetivos, alcance, audiencias, partes del producto.
- **Arquitectura y paquetes**: cómo se organizan `apps/`, `packages/` y flujos entre ellos.
- **Sistemas transversales**: diseño de componentes, tipos, servicios, test, accesibilidad, etc.
- **Flujos clave de usuario**: qué pasos sigue el usuario, qué páginas/servicios intervienen.
- **Decisiones relevantes** (semi-ADR): por qué se eligió una aproximación frente a otras cuando tiene impacto fuerte.

Cada archivo debe tener **un foco claro**. No mezcles demasiados temas en un mismo documento.

## Flujo de trabajo del agente documentador

Sigue siempre este flujo, adaptándolo al tamaño del cambio:

### 1. Analizar el cambio

1. Identifica:
   - ¿Qué parte del sistema ha cambiado? (paquetes, apps, integraciones Astro…).
   - ¿Qué impacto tiene para el usuario o para otros desarrolladores?
   - ¿Qué hay de realmente **diferenciador o nuevo** respecto al contexto ya documentado?
2. Localiza en `.cursor/context/` si ya existe un documento relacionado con el tema.

Si no existe un documento adecuado, planifica crear uno nuevo y elige un nombre descriptivo en kebab-case o snake_case (ej.: `monorepo_turbo.md`, `integracion_starbook.md`).

### 2. Decidir entre actualizar o crear documento

- **Actualizar documento existente** cuando:
  - El cambio amplía o corrige un tema ya cubierto.
  - El nombre y foco del archivo siguen siendo válidos.
- **Crear nuevo documento** cuando:
  - El cambio introduce un área claramente nueva (nuevo paquete, app o flujo).
  - El tema no encaja bien en ninguno de los archivos actuales.

Evita crear muchos documentos pequeños con temas solapados; prioriza la claridad temática.

### 3. Sintetizar la información

Antes de escribir, realiza una síntesis breve respondiendo mentalmente a:

- **¿Qué problema resuelve o qué aporta este cambio?**
- **¿Cómo afecta al modelo de datos, tipos o paquetes?**
- **¿Qué flujos de usuario o integración cambian?**
- **¿Hay decisiones de diseño o trade-offs que merezca la pena recordar?**

Sólo lleva al documento las respuestas que sean:

- Imprescindibles para entender el sistema más adelante.
- Difíciles de reconstruir solo leyendo el código.
- Útiles para onboarding o para evitar errores futuros.

### 4. Redactar el documento

Redacta siempre en **español**, con secciones claras y concisas. Usa esta plantilla como referencia:

```markdown
# [Título claro del tema]

## Índice

1. [Resumen](#resumen)
2. [Contexto y objetivos](#contexto-y-objetivos)
3. [Estructura y elementos clave](#estructura-y-elementos-clave)
4. [Flujos principales](#flujos-principales)
5. [Impacto en el sistema](#impacto-en-el-sistema)
6. [Pendientes y riesgos](#pendientes-y-riesgos)

---

## Resumen

Breve párrafo que explique qué se ha introducido o cambiado y por qué es relevante.

## Contexto y objetivos

- Qué problema aborda.
- Qué objetivo funcional o técnico persigue.

## Estructura y elementos clave

- Paquetes, apps o tipos involucrados.
- Componentes o rutas relevantes.
- Servicios o adaptadores importantes.

## Flujos principales

Descripción centrada en el usuario o en el flujo de datos:

1. Paso 1...
2. Paso 2...

## Impacto en el sistema

- Cómo afecta a otras secciones o sistemas.
- Compatibilidad hacia atrás, migraciones, cambios de contratos, etc.

## Pendientes y riesgos

- Tareas futuras relacionadas.
- Riesgos conocidos o decisiones a revisar más adelante.
```

Cuando actualices un documento existente, intenta mantener su estructura original y agrega/ajusta secciones mínimamente para no romper el estilo.

### 5. Guardar en `.cursor/context/`

- Escribe o actualiza el archivo correspondiente en `.cursor/context/`.
- Usa nombres descriptivos en `snake_case` o `kebab-case`.
- Las subcarpetas (p.ej. `context/@radix-ui/`) solo si el proyecto ya las usa para agrupar referencias.

## Revisión y mantenimiento

Cuando el usuario pida **revisar la documentación**:

1. Lee los archivos relevantes de `.cursor/context/` para el tema indicado.
2. Comprueba:
   - Si siguen siendo fieles al comportamiento actual del código.
   - Si hay secciones redundantes, desactualizadas o demasiado detalladas.
3. Propón o aplica:
   - Recortes de información irrelevante.
   - Reestructuración de secciones para mejorar claridad.
   - Actualizaciones de contenido para reflejar el estado actual del sistema.

Prioriza siempre:

- **Claridad** sobre exhaustividad.
- **Actualidad** sobre historia antigua salvo que sea una decisión clave.

## Ejemplos de uso de la skill

- Después de añadir una nueva integración Astro en `packages/starbook`:
  - Actualizar o crear un documento que describa el hook, rutas inyectadas y cómo probarlas en `apps/workshop`.
- Tras cambiar el pipeline de Turbo o workspaces:
  - Documentar comandos y orden de build en un archivo de contexto dedicado.
