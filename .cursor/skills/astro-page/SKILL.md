---
name: astro-page
description: Explica cómo crear una página Astro en el monorepo usando layouts, meta y rutas. Usar cuando se añadan o modifiquen rutas `.astro` en `src/pages/**` de apps o paquetes.
---

# Crear página Astro

## Trigger

Usar esta skill cuando vayas a **crear o modificar una página Astro** (`.astro`) en `src/pages/**`, por ejemplo nuevas rutas de contenido.

## Utiliza también

- skill `astro-conventions`
- skill `css-conventions`

## Patrón general de página

Las páginas Astro siguen el siguiente patrón:

```astro
---
/* 1 - imports */

/* 2 - función getStaticPaths para páginas con slug */
export async function getStaticPaths() {
  const items = await getAllItems();

  return items.map((item) => {
    return {
      params: { slug: item.slug },
      props: { item },
    };
  });
}

/* 3 - interface */
interface Props {
  item: CollectionEntry<"items">;
}
/* 4 - desectructuración props */
const { item } = Astro.props;
const { name, description, date } = item.data;

/* 5 - otra lógica */

const formatted = date.toLocaleString();

/* 6 - meta info */
const meta: MetaInfo = {
  pageTitle: "Título | Starbook",
  pageDescription: "…",
  pageTags: ["Astro", "Documentación"],
  pageUrl: `https://example.com/ruta`,
};
---

<!-- 7 - Html envuelto en sus correspondientes Layouts -->
<HtmlLayout metaInfo={meta}>
  <main>
    <!-- contenido -->
  </main>
</HtmlLayout>

<!-- 8 - Estilos de la pagina -->
<style>
  main {
    min-height: 100vh;
  }
</style>
```

## Pasos para crear una nueva página `.astro`

### 1. Elegir ruta y nombre de fichero

- Todas las páginas viven bajo `src/pages/**` siguiendo las reglas de enrutado de Astro:
  - `src/pages/seccion/index.astro` → `/seccion`
  - `src/pages/seccion/[slug].astro` → `/seccion/:slug`
- Usa `index.astro` para la raíz de una sección.

### 2. Importar el layout HTML

- Usa el layout común del proyecto (p.ej. `HtmlLayout`) para:
  - Inyectar `metaInfo` de la página.
  - Compartir cabecera, tipografías, etc.

### 3. Definir `metaInfo` de la página

- Construye un objeto `meta: MetaInfo` con:
  - `pageTitle`: título descriptivo + branding.
  - `pageDescription`: resumen de la página optimizado para SEO.
  - `pageTags`: lista de etiquetas relevantes.
  - `pageUrl`: URL absoluta de la página.

Pásalo al layout con la prop `metaInfo`:

### 4. Cargar datos desde colecciones

- En páginas que requieran de contenido, usa servicios o loaders del proyecto.
- Si necesitas nuevas colecciones, asegúrate de que existen en el sistema de contenido/schemas.

```typescript
const caves = getAllCaves();
```

- Desestructura las propiedades que vayas a necesitar en el contenido.
- Realiza las transformaciones necesarias en los datos.
- Si el código de transformación es largo (+ de 8 lineas) o potencialmente repetitivo valora extraerlo a una función en `/utils` o equivalente.

### 5. Componer la página con componentes compartidos

- Dentro del layout, renderiza un `<main>` y planifica el contenido de su interior.
- Reutiliza componentes de `src/components/**` siempre que sea posible antes de crear nuevos.
- Mantén la página como **composición de secciones**, dejando la lógica de presentación en los componentes.

### 6. Estilos de la página

- Las páginas pueden tener un pequeño bloque `<style>` para estilos globales específicos de la vista (p.ej. altura mínima del `main`).
- Mantén la lógica de estilos complejos en los componentes, no en la página.
- **Nombrado de clases:** Si defines clases en la página, sigue la misma convención que en componentes: clases descriptivas y breves (`icon`, `title`, etc.); contenedores con nombres como `horizontal-layout`, `link-container`. Ver skill **astro-component** (apartado “Nombrado de clases CSS”).

### 7. Accesibilidad y estructura semántica

- Asegúrate de que:
  - El layout o los componentes de cabecera exponen un `h1` claro.
  - El contenido principal está dentro de `<main>`.
  - Las secciones usan `section` con títulos (`h2`, `h3`), siguiendo la jerarquía.
- Consulta la skill `accesibility` cuando exista y aplicala a toda la página.

### 8. Testing

- Añade un archivo de testing junto a la pagina.

```folder
Page.astro
_Page.test.ts
```

- Aplica la skill `testing-astro-pages` para generar los test cuando esté definida.

## Checklist rápido

- [ ] La página está definida en `src/pages/**` con el nombre de fichero correcto (`index.astro`, `[slug].astro`, etc.).
- [ ] Se importa y utiliza el layout estándar con `metaInfo`.
- [ ] `metaInfo` tiene `pageTitle`, `pageDescription`, `pageTags` y `pageUrl` coherentes.
- [ ] Los datos provienen de servicios/helpers del proyecto, no de lógica ad-hoc innecesaria.
- [ ] El contenido principal está dentro de `<main>`.
- [ ] La página se compone de secciones reutilizando componentes existentes.
- [ ] Los estilos específicos de la página son mínimos y van al final en `<style>`.
- [ ] La estructura es semántica y accesible (cabeceras, main, secciones).
- [ ] Se han generado test para la página cuando aplique.
