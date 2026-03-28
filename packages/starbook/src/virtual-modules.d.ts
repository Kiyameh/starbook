declare module 'virtual:starbook/catalog' {
  import type { CatalogBuildResult } from './types/catalog-build-result.js';

  export const catalogBuildResult: CatalogBuildResult;
  /** Normalized path prefix (leading slash, no trailing slash), e.g. `/uiverse`. */
  export const starbookBasePath: string;
}
