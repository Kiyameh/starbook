import ts from 'typescript';
import type { CatalogDiagnostic } from '../../types/diagnostic.js';
import { getObjectPropertyInitializer } from './get-object-property-initializer.js';
import { getStringLiteralValue } from './get-string-literal-value.js';
import { resolveComponentPath } from './resolve-component-path.js';

export function readDefaultMetadata(
  sourceFile: ts.SourceFile,
  filePath: string,
  defaultImportsByIdentifier: Map<string, string>,
): { value: { componentPath: string; constellation: string; title: string } | null; diagnostics: CatalogDiagnostic[] } {
  const diagnostics: CatalogDiagnostic[] = [];
  let exportAssignment: ts.ExportAssignment | null = null;

  for (const statement of sourceFile.statements) {
    if (!ts.isExportAssignment(statement)) continue;
    if (statement.isExportEquals) continue;
    exportAssignment = statement;
    break;
  }

  if (!exportAssignment) {
    diagnostics.push({
      type: 'error',
      filePath,
      message: 'Missing default export in star file.',
    });
    return { value: null, diagnostics };
  }

  if (!ts.isObjectLiteralExpression(exportAssignment.expression)) {
    diagnostics.push({
      type: 'error',
      filePath,
      message: 'Default export must be an object literal.',
    });
    return { value: null, diagnostics };
  }

  const componentNode = getObjectPropertyInitializer(exportAssignment.expression, 'component');
  const constellationNode = getObjectPropertyInitializer(exportAssignment.expression, 'constellation');
  const titleNode = getObjectPropertyInitializer(exportAssignment.expression, 'title');

  const componentPath = resolveComponentPath(componentNode, defaultImportsByIdentifier);
  const constellation = getStringLiteralValue(constellationNode);
  const title = getStringLiteralValue(titleNode);

  if (!componentPath) diagnostics.push({ type: 'error', filePath, message: 'default.component must reference a default import.' });
  if (!constellation) diagnostics.push({ type: 'error', filePath, message: 'default.constellation must be a string literal.' });
  if (!title) diagnostics.push({ type: 'error', filePath, message: 'default.title must be a string literal.' });

  if (!componentPath || !constellation || !title) return { value: null, diagnostics };
  return { value: { componentPath, constellation, title }, diagnostics };
}
