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

/** Absolute path to the injected route (resolves from dist/ at runtime). */
const previewTestPage = fileURLToPath(new URL('../src/pages/test.astro', import.meta.url));
const VIRTUAL_CATALOG_MODULE = 'virtual:starbook/catalog';
const RESOLVED_VIRTUAL_CATALOG_MODULE = '\0virtual:starbook/catalog';

export default function starbook(options: StarbookOptions = {}): AstroIntegration {
  const base = options.base ?? '/uiverse';

  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig, logger }) => {
        logger.info(`Starbook: Initializing preview route at ${base}/test ...`);
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
                  return `export const catalogBuildResult = ${serialized};`;
                },
              },
            ],
          },
        });

        injectRoute({
          pattern: `${base}/test`,
          entrypoint: previewTestPage,
        });
      },
    },
  };
}
