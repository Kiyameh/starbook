import ts from 'typescript';

export function getStringLiteralValue(node: ts.Expression | null): string | null {
  if (!node) return null;
  if (!ts.isStringLiteral(node)) return null;
  return node.text;
}
