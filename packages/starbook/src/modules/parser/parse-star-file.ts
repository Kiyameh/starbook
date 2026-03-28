import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import type { CatalogDiagnostic } from '../../types/diagnostic.js';
import { collectDefaultImports } from './collect-default-imports.js';
import type { ParseResult } from './types.js';
import { readDefaultMetadata } from './read-default-metadata.js';
import { readPhases } from './read-phases.js';

export async function parseStarFile(filePath: string): Promise<ParseResult> {
  const diagnostics: CatalogDiagnostic[] = [];
  const sourceText = await readFile(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const defaultImportsByIdentifier = collectDefaultImports(sourceFile, filePath);

  const metadata = readDefaultMetadata(sourceFile, filePath, defaultImportsByIdentifier);
  diagnostics.push(...metadata.diagnostics);

  const phases = readPhases(sourceFile, filePath);
  diagnostics.push(...phases.diagnostics);

  if (!metadata.value) return { parsedStar: null, diagnostics };
  if (!phases.value.length) {
    diagnostics.push({
      type: 'error',
      filePath,
      message: 'Star file has no valid exported phases.',
    });
    return { parsedStar: null, diagnostics };
  }

  return {
    parsedStar: {
      filePath,
      componentPath: metadata.value.componentPath,
      constellation: metadata.value.constellation,
      title: metadata.value.title,
      phases: phases.value,
    },
    diagnostics,
  };
}
