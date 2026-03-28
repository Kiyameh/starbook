import { fileURLToPath } from 'node:url';

import type { AstroIntegration } from 'astro';
import type { StarbookOptions } from './starbook-options.js';
import { buildCatalog } from './modules/catalog/index.js';

export { buildCatalog } from './modules/catalog/index.js';
export type {
  CatalogConstellation,
  CatalogPhase,
  CatalogStar,
  StarCatalog,
} from './modules/catalog/index.js';
export type { CatalogBuildResult, CatalogDiagnostic } from './types/index.js';
export type { ParsedPhase, ParsedStarFile } from './modules/parser/index.js';
export {
  buildUiversePathParam,
  listPhaseStaticParams,
  parseUiverseUrlParam,
  resolveUiversePath,
} from './modules/uiverse-path/index.js';
export type { ResolvedUiversePhase, ResolveUiversePathResult } from './modules/uiverse-path/index.js';

/** Absolute path to injected routes (resolved from dist/ at runtime). */
const uiverseIndexPage = fileURLToPath(new URL('../src/pages/uiverse-index.astro', import.meta.url));
const uiversePhasePage = fileURLToPath(
  new URL('../src/pages/uiverse/[...uiverse].astro', import.meta.url),
);
const debugCatalogPage = fileURLToPath(new URL('../src/pages/debug.astro', import.meta.url));

const VIRTUAL_CATALOG_MODULE = 'virtual:starbook/catalog';
const RESOLVED_VIRTUAL_CATALOG_MODULE = '\0virtual:starbook/catalog';

function normalizeBasePath(raw: string): string {
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  const trimmed = withLeading.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export default function starbook(options: StarbookOptions = {}): AstroIntegration {
  const base = normalizeBasePath(options.base ?? '/uiverse');

  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig, logger }) => {
        logger.info(`Starbook: Uiverse en ${base} (índice, phases y ${base}/debug).`);
        const hostSrcDir = fileURLToPath(new URL('./src', config.root));

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'starbook-catalog-virtual-module',
                resolveId(source) {
                  if (source !== VIRTUAL_CATALOG_MODULE) return null;
                  return RESOLVED_VIRTUAL_CATALOG_MODULE;
                },
                async load(id) {
                  if (id !== RESOLVED_VIRTUAL_CATALOG_MODULE) return null;

                  const result = await buildCatalog({ rootDir: hostSrcDir });
                  const serialized = JSON.stringify(result);
                  return `export const catalogBuildResult = ${serialized};
export const starbookBasePath = ${JSON.stringify(base)};`;
                },
              },
            ],
          },
        });

        injectRoute({
          pattern: `${base}`,
          entrypoint: uiverseIndexPage,
        });
        injectRoute({
          pattern: `${base}/debug`,
          entrypoint: debugCatalogPage,
        });
        injectRoute({
          pattern: `${base}/[...uiverse]`,
          entrypoint: uiversePhasePage,
        });
      },
    },
  };
}
