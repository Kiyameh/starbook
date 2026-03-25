# Configuración de Cursor - Starbook

Configuración de Cursor (rules, skills, context, MCP) para el proyecto.

## Contenido

- **`rules/`**: Reglas de arquitectura, estilo y convenciones (**siempre aplican**).
- **`skills/`**: Skills personalizadas para tareas concretas y repetibles.
- **`context/`**: Documentación adicional para consultar solo si es necesaria.
- **`mcp.json`**: Configuración de servidores Model Context Protocol.

## Prioridad de instrucciones

De mayor a menor prioridad, Cursor interpreta las instrucciones así:

1. **Sistema de Cursor** (modo Ask/Agent, restricciones globales).
2. **Lo que se pide explícitamente en el chat**.
3. **Rules del workspace** (`.cursor/rules/*.mdc`).
4. **Skills** (`.cursor/skills/**/SKILL.md`) cuando son relevantes para la tarea.
5. **Contexto** (`.cursor/context/**`) y resto de documentación del repo.

Usa `rules/` para lo que debe cumplirse siempre y `skills/` para guías operativas de tareas concretas.

### Rules

Cada rule es un archivo `.mdc` en `rules/`:

```folder
rules/
  general.mdc
  ...
```

Las rules se aplican **automáticamente siempre** al trabajar en este repositorio.

### Skills

Cada skill tiene su carpeta con `SKILL.md`:

```folder
skills/
  arquitectura/
    SKILL.md
  testing-unit/
    SKILL.md
  pr/
    SKILL.md
  ...
```

Las skills se usan de dos formas:

- El agente las invoca automáticamente cuando la tarea encaja (p.ej. testing, PR, arquitectura).
- También aparecen en el slash command `/` de Cursor.

### Context

Archivos de documentación y referencias que el agente puede consultar cuando lo necesita:

```folder
context/
  caracteristicas_proyecto.md
  ...
```

El contenido de `context/` **no es normativo**, sirve como documentación de apoyo.

### MCP (`mcp.json`)

- `mcp.json` define los servidores MCP disponibles en este proyecto (GitHub, Figma, Astro docs, etc.).

Mantén este archivo actualizado cuando añadas nuevas rules, skills o contextos importantes.
