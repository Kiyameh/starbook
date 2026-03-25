---
name: astro-component
description: Explica cómo crear y estructurar un componente Astro en el monorepo. Usar cuando se añadan o refactoricen componentes `.astro`.
---

# Crear componente Astro

## Trigger

Usar esta skill cuando vayas a **crear o refactorizar un componente Astro** (`.astro`) en `src/components/**` o en paquetes del workspace.

## Utiliza también

- skill `astro-conventions`
- skill `css-conventions`

## Patrón general de componente

Los componentes Astro siguen estos principios:

- **Tipado de props** con `interface Props` y `Astro.props`.
- **Imports** con alias del proyecto cuando existan (`@/types`, `@/utils`, `astro:assets`, etc.).
- **Estilos locales** dentro del propio fichero usando `<style>` y, cuando se necesite, `define:vars`.
- **Sistema de diseño**: variables CSS y utilidades definidas en el proyecto.
- HTML semántico y accesible (consultar skill `accesibility` cuando haya dudas).

### Ejemplo base (tipo `HeroSection`)

```astro
---
/* 1 - imports */

/* 2 - interface */
interface Props {
  title: string;
  description: string;
  photo?: Photography;
  fullHeight?: boolean;
}

/* 3 - desectructuración props */
const { title, description, photo, fullHeight = false } = Astro.props;

/* 4 - función get de collecciones si hacen falta */

/* 5 - otra lógica */
const height = fullHeight ? "94vh" : isDefined(photo) ? "50vh" : "25vh";
---

<!-- 6 - Html -->{
  photo ? (
    <header>
      <Image
        src={photo.image}
        alt={photo.caption}
        class="hero-image"
        loading="eager"
        quality={90}
        inferSize
      />
      <div class="box glassmorph">
        <h1 class="hero-title">{title}</h1>
        <p class="hero-subtitle">{description}</p>
      </div>
    </header>
  ) : (
    <header>
      <div class="container">
        <h1 class="hero-title">{title}</h1>
        <p class="hero-subtitle">{description}</p>
      </div>
    </header>
  )
}

<!-- 7 - Estilos -->
<style define:vars={{ height }}>
  header {
    position: relative;
    display: flex;
    min-height: var(--height);
  }
</style>
```

## Pasos para crear un nuevo componente `.astro`

### 1. Elegir ubicación y nombre

- Coloca el componente en la carpeta adecuada del paquete o app.
- Usa nombres en **PascalCase** para componentes (`HeroSection.astro`, `SectionGrid.astro`, `CollectionCard.astro`).

### 2. Definir las props tipadas

- Declara siempre una `interface Props` al inicio del bloque frontmatter.
- Expón solo las props necesarias, con tipos importados del dominio cuando aplique.

Si el componente admite opciones limitadas, utiliza **unión literal** o tipos más concretos en lugar de `number | string` genéricos.

### 3. Importar utilidades y assets

- Usa imports con alias del proyecto cuando existan:
  - Tipos: `import type { CollectionMeta } from "@/types";`
  - Utilidades: `import { toSpanish } from "@/utils";`
  - Imágenes optimizadas: `import { Image } from "astro:assets";`
- Evita repetir lógica de formato si ya existe una utilidad.

### 4. Estructurar el markup

- Usa elementos semánticos:
  - `section` para bloques de página (`SectionGrid`).
  - `article` para tarjetas de contenido (`CollectionCard`).
  - `header` para cabeceras de sección o hero.
- Aplica clases del sistema de diseño cuando existan.
- Mantén el componente **centrado en una responsabilidad** (hero, tarjeta, grid, sección…).

Ejemplo Tarjeta enlazable:

```astro
<article>
  <a href={slug}>
    <div class="image-container">
      <!-- imagen opcional -->
    </div>

    <div class="content">
      <!-- meta + título + descripción -->
    </div>
  </a>
</article>
```

### 5. Añadir estilos locales

- Define siempre los estilos en un bloque `<style>` al final del fichero.
- Usa el sistema de estilos definido en `rules/guia_estilos.mdc`.
- Para props que afectan al layout (como el nº de columnas), usa `define:vars`:

#### Nombrado de clases CSS

En Astro los estilos tienen **scope limitado al propio archivo**, así que no hace falta prefijar las clases con el nombre del componente (evitar convenciones tipo BEM con prefijo `ComponentName__element`).

- **Clases descriptivas y breves**, según lo que se ve en la interfaz, sin prefijo del componente:
  - Ejemplos: `icon`, `title`, `description`, `quote`, `table-header`
- **Excepción: contenedores** — los elementos que agrupan estructura o layout pueden usar nombres de contenedor:
  - Ejemplos: `horizontal-layout`, `link-container`, `callout-card`, `link-card`
- Evitar: `resource__icon`, `cta-card__title`; preferir: `icon`, `title` (y un contenedor como `callout-card` si hace falta).

### 6. Accesibilidad

Al crear el componente:

- Asegúrate de que:
  - Las imágenes tienen `alt` descriptivo (o vacío si son decorativas).
  - Los `h1`, `h2`… tienen contenido claro.
  - Las tarjetas clicables usan `<a>` dentro de `<article>` (no `div` con `onClick`).
- Si el componente añade interactividad extra o patrones complejos, consulta la skill `accesibility`.

### 7. Testing

- Añade un archivo de testing junto al componente.

```folder
Card.astro
Card.test.ts
```

- Aplica la skill `testing-astro-components` para generar los test cuando esté definida.

## Checklist rápido

Copia y utiliza esta checklist al crear un nuevo componente Astro:

- [ ] El fichero vive en la carpeta correcta (`src/components/...` o paquete).
- [ ] Las props están tipadas en una `interface Props` y se leen desde `Astro.props`.
- [ ] Los imports usan alias del proyecto cuando existan (`@/types`, `@/utils`, `astro:assets`).
- [ ] El HTML es semántico (`section`, `article`, `header`, etc.).
- [ ] Los estilos están en `<style>` al final y usan tokens del diseño.
- [ ] Las clases son descriptivas y breves (ej. `icon`, `title`, `description`); solo los contenedores usan nombres como `link-card`, `callout-card`.
- [ ] Las imágenes tienen `alt` adecuado.
- [ ] No hay lógica de formato duplicada que ya exista en utilidades del proyecto.
- [ ] Se han generado test para el componente cuando aplique.
