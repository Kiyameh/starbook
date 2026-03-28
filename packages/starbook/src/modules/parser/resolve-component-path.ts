import ts from 'typescript';

export function resolveComponentPath(node: ts.Expression | null, defaultImportsByIdentifier: Map<string, string>): string | null {
  if (!node) return null;
  if (!ts.isIdentifier(node)) return null;
  return defaultImportsByIdentifier.get(node.text) ?? null;
}
