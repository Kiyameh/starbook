import type { StarCatalog } from '../modules/catalog/types.js';
import type { CatalogDiagnostic } from './diagnostic.js';

export interface CatalogBuildResult {
  catalog: StarCatalog;
  diagnostics: CatalogDiagnostic[];
  scannedFiles: string[];
  parsedFiles: string[];
}
