# Wormhole — Documento base (v0)

Documento base del mecanismo de inyección de datos para Starbook en Ignition.

---

## 1) Problema que resuelve

Permite renderizar Stars con datos reales del proyecto host sin crear mocks manuales, manteniendo al componente desacoplado de Starbook.

---

## 2) API base acordada

```ts
wormhole(itemToTranspass, options?, importName)
```

- `itemToTranspass`: dato a inyectar.
- `options`: configuración opcional (pendiente de formalizar).
- `importName`: alias de import que será interceptado por Starbook.

---

## 3) Flujo conceptual

1. En contexto SSR, el autor registra un binding con `wormhole(...)`.
2. Starbook registra el alias en un `wormhole-registry`.
3. Un import del tipo `import data from 'my-products'` se resuelve por virtual module.
4. El componente recibe el dato como si fuera un módulo normal.

---

## 4) Alcance de Ignition (MVP)

- Soporte principal: **SSR en dev** mediante virtual modules de Vite.
- Cliente: solo datos serializables.
- Funciones en cliente: fuera de alcance.
- Fallback si no hay binding: `undefined` + warning en consola dev.

---

## 5) Reglas operativas (base)

- `importName` debe ser único en el scope efectivo para evitar colisiones.
- El componente documentado no debe depender de APIs internas de Starbook.
- Wormhole debe poder usarse por Star o de forma reutilizable (modelo final pendiente).

---

## 6) Riesgos y decisiones pendientes

- Definir scope exacto de registro (global, por request, por Star).
- Definir política de seguridad para evitar imports ambiguos.
- Diseñar estrategia futura para cliente con datos no serializables.
- Establecer trazabilidad/debug de bindings activos en Uiverse.
