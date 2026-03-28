import ts from 'typescript';
import type { CatalogDiagnostic } from '../../types/diagnostic.js';
import type { ParsedPhase } from './types.js';
import { getObjectPropertyInitializer } from './get-object-property-initializer.js';
import { hasExportModifier } from './has-export-modifier.js';
import { literalNodeToValue, NON_SERIALIZABLE_VALUE } from './literal-node-to-value.js';

export function readPhases(
  sourceFile: ts.SourceFile,
  filePath: string,
): { value: ParsedPhase[]; diagnostics: CatalogDiagnostic[] } {
  const diagnostics: CatalogDiagnostic[] = [];
  const phases: ParsedPhase[] = [];
  const phaseNames = new Set<string>();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (!hasExportModifier(statement.modifiers)) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      if (!declaration.initializer) continue;
      if (!ts.isObjectLiteralExpression(declaration.initializer)) continue;

      const argsNode = getObjectPropertyInitializer(declaration.initializer, 'args');
      if (!argsNode) continue;

      const args = literalNodeToValue(argsNode);
      if (args === NON_SERIALIZABLE_VALUE) {
        diagnostics.push({
          type: 'error',
          filePath,
          message: `Phase "${declaration.name.text}" has args that are not supported literal values for MVP.`,
        });
        continue;
      }

      const phaseName = declaration.name.text;
      if (phaseNames.has(phaseName)) {
        diagnostics.push({
          type: 'error',
          filePath,
          message: `Phase "${phaseName}" is duplicated.`,
        });
        continue;
      }

      phaseNames.add(phaseName);
      phases.push({ name: phaseName, args });
    }
  }

  return { value: phases, diagnostics };
}
