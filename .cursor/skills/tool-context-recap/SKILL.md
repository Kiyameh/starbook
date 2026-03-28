---
name: tool-context-recap
description: Guía interactiva para revisar y entender los cambios de git tras una sesión de codificación con IA.
disable-model-invocation: true
---

# Tool: Context Recap

## Objetivo

Repaso guiado e interactivo de los cambios de git tras una sesión de codificación con IA. Analiza todos los cambios, los agrupa en bloques lógicos y explica cada uno al usuario de forma clara y concisa, esperando su feedback antes de continuar. Usar cuando el usuario invoque /tool-context-recap o quiera entender qué cambios se hicieron en la sesión.

## Regla Fundamental

**Esperar siempre el feedback del usuario antes de avanzar al siguiente bloque.** No avanzar automáticamente.

## Proceso

### 1. Recopilar cambios

```bash
git status
git diff HEAD
git diff --cached
```

Si hay cambios sin staging, incluirlos también. Si hay commits recientes no pusheados, considerar añadirlos con `git log origin/HEAD..HEAD`.

### 2. Agrupar en bloques

Agrupa los archivos modificados en bloques lógicos. Un bloque puede ser:

- **Un solo archivo** (si es complejo o autónomo)
- **Varios archivos** que implementan la misma funcionalidad (ej: un módulo con su tipos, su lógica y sus tests)
- **Un fragmento de archivo** si el archivo es muy grande y tiene partes independientes

Criterios de agrupación (de mayor a menor prioridad):

1. Funcionalidad que implementan
2. Capa de arquitectura (tipos, lógica, UI, config…)
3. Directorio

### 3. Crear índice de bloques

Antes de empezar, presenta al usuario el índice completo:

```
📋 Cambios detectados — X bloques

[ 1 ] Nombre del bloque — archivo(s)
[ 2 ] Nombre del bloque — archivo(s)
[ 3 ] Nombre del bloque — archivo(s)
...

Empezamos con el bloque 1. ¿Listo?
```

Esperar confirmación del usuario antes de continuar.

### 4. Bucle por bloques

Para cada bloque, seguir este ciclo:

#### 4a. Presentar el bloque

```
─── Bloque [N/Total]: Nombre del bloque ───

Archivos: archivo1.ts, archivo2.ts

[Explicación breve y clara del bloque]
```

La explicación debe:

- Describir **qué hace** el bloque (no cómo está implementado línea a línea)
- Mencionar **por qué existe** (qué problema resuelve en el contexto del proyecto)
- Destacar decisiones de diseño relevantes si las hay
- Ser concisa: 3-6 frases como máximo

Terminar siempre con:

```
¿Algún feedback? (continúa / explícame más / añade comentario / ...)
```

#### 4b. Gestionar feedback

| Feedback del usuario                            | Acción                                                  |
| ----------------------------------------------- | ------------------------------------------------------- |
| "continúa" / "siguiente" / "ok"                 | Avanzar al siguiente bloque                             |
| "explícame más" / "no entiendo"                 | Ampliar la explicación con más detalle                  |
| "añade un comentario en X"                      | Editar el archivo y añadir el comentario                |
| "sepáralo en dos archivos" / cualquier refactor | Ejecutar el cambio y luego volver a presentar el bloque |
| "¿por qué X?"                                   | Responder la pregunta y volver a ofrecer feedback       |

Tras resolver cualquier feedback que implique cambios en código, volver a presentar el bloque actualizado brevemente antes de esperar el siguiente feedback.

#### 4c. Avanzar

Cuando el usuario confirme que puede avanzar, mostrar:

```
✓ Bloque [N] completado

─── Bloque [N+1/Total]: ...
```

### 5. Finalizar

Cuando todos los bloques estén completados:

```
✅ Repaso completado — [N] bloques revisados

Resumen de cambios realizados durante el repaso:
- [lista de cambios de código hechos durante el repaso, si los hay]

¿Quieres hacer algo más con estos cambios? (commits, documentación, etc.)
```
