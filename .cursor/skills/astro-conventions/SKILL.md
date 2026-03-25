---
name: astro-conventions
description: Convenciones de código astro
---

# Convenciones de Código Astro

## Trigger

Usar cuando se va a escribir o editar código Css o Css modules

- Usar también la skill `css-conventions`

## Herramientas

- Puedes usar, si corresponde, estas herramientas para hacer el código css más moderno y legible:

### Usa directivas de cliente (client:\*) solo cuando el componente necesite interactividad estricta (JavaScript en el navegador)

```astro
---
import CarruselInteractivo from "./CarruselInteractivo.jsx";
---

<CarruselInteractivo client:visible />
```

### Usa la directiva `class:list` para aplicar clases CSS dinámicas o condicionales de forma limpia.

```astro
---
const { tipo } = Astro.props;
const esPeligro = tipo === "error";
---

<div
  class:list={[
    "alerta-base",
    { "alerta-error": esPeligro, "alerta-info": !esPeligro },
  ]}
>
  Mensaje de alerta
</div>
```

### Usa `<slot />` con nombre (Named Slots) para crear componentes de diseño (Layouts) altamente flexibles.

```astro
---
// Componente: Tarjeta.astro
---

<article class="tarjeta">
  <header><slot name="cabecera" /></header>
  <div class="contenido"><slot /></div>
  <footer><slot name="pie" /></footer>
</article>

<Tarjeta>
  <h2 slot="cabecera">Título</h2>
  <p>Contenido principal aquí.</p>
  <button slot="pie">Aceptar</button>
</Tarjeta>
```

### Usa la directiva define:vars para pasar variables de JavaScript/TypeScript directamente a CSS.

```astro
---
const { colorTema } = Astro.props;
---

<div class="caja">Contenido</div>

<style define:vars={{ colorTema }}>
  .caja {
    background-color: var(--colorTema);
  }
</style>
```
