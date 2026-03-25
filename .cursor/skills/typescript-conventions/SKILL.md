---
name: typescript-conventions
description: Convenciones de código TypeScript
---

# Convenciones de Código TypeScript / React

## Trigger

Usar cuando se va a escribir o editar código TypeScript o React: componentes, hooks, servicios, utils.

### No usar enums

Usar arrays const como fuente de tipos literales u objetos `as const`:

```typescript
// ❌ MAL
enum Status {
  Active,
  Inactive,
}

// ✅ BIEN - Array como fuente
const STATUSES = ["active", "inactive"] as const;
type Status = (typeof STATUSES)[number];

// ✅ BIEN - Objeto const
const Status = { Active: "active", Inactive: "inactive" } as const;
```

### Evitar llaves si es posible

```typescript
// ✅
if (condition) doSomething();

// ❌
if (condition) {
  doSomething();
}
```

### Parámetros de funciones

Usar parámetros separados en vez de objeto, salvo cuando el objeto mejore la legibilidad:

```typescript
// ✅ Por defecto: parámetros separados
function calculate(amount: number, rate: number) {}

// ✅ Excepción: muchos params o mejora legibilidad
function createUser({ name, email, age }: CreateUserParams) {}
```

### Type guards del proyecto

Si el monorepo define utilidades (`isDefined`, etc.) en un paquete compartido, preferirlas frente a comparaciones manuales repetidas:

```typescript
// ❌
if (value !== undefined && value !== null) { ... }
const items = array.filter(item => item !== undefined);

// ✅ (ajusta la ruta de import al paquete real)
import { isDefined } from '@starbook/utils';

if (isDefined(value)) { ... }
const items = array.filter(isDefined);
```

Si aún no existen helpers compartidos, usar chequeos explícitos claros y extraer helpers cuando se repitan.
