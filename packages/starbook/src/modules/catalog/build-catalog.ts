import type { CatalogBuildResult } from '../../types/catalog-build-result.js';
import type { CatalogDiagnostic } from '../../types/diagnostic.js';
import type { ParsedStarFile } from '../parser/types.js';
import { parseStarFile } from '../parser/parse-star-file.js';
import { scanStarFiles } from '../scanner/scan-star-files.js';
import { buildCatalogTree } from './build-catalog-tree.js';

interface BuildCatalogOptions {
  rootDir: string;
}

export async function buildCatalog(options: BuildCatalogOptions): Promise<CatalogBuildResult> {
  const diagnostics: CatalogDiagnostic[] = [];
  const scannedFiles = await scanStarFiles(options.rootDir);
  const parsedStars: ParsedStarFile[] = [];

  for (const filePath of scannedFiles) {
    const parsed = await parseStarFile(filePath);
    diagnostics.push(...parsed.diagnostics);
    if (parsed.parsedStar) parsedStars.push(parsed.parsedStar);
  }

  const catalog = buildCatalogTree(parsedStars, diagnostics);

  return {
    catalog,
    diagnostics,
    scannedFiles,
    parsedFiles: parsedStars.map((item) => item.filePath),
  };
}
