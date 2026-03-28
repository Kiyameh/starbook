import type { CatalogDiagnostic } from '../../types/diagnostic.js';

export interface ParsedPhase {
  name: string;
  args: unknown;
}

export interface ParsedStarFile {
  filePath: string;
  componentPath: string;
  constellation: string;
  title: string;
  phases: ParsedPhase[];
}

export interface ParseResult {
  parsedStar: ParsedStarFile | null;
  diagnostics: CatalogDiagnostic[];
}
