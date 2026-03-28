import path from 'node:path';
import ts from 'typescript';

export function collectDefaultImports(sourceFile: ts.SourceFile, filePath: string): Map<string, string> {
  const importsMap = new Map<string, string>();

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (!statement.importClause?.name) continue;

    const specifier = statement.moduleSpecifier;
    if (!ts.isStringLiteral(specifier)) continue;

    const identifier = statement.importClause.name.text;
    const resolvedPath = path.resolve(path.dirname(filePath), specifier.text);
    importsMap.set(identifier, resolvedPath);
  }

  return importsMap;
}
