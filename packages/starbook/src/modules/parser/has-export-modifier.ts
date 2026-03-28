import ts from 'typescript';

export function hasExportModifier(modifiers: ts.NodeArray<ts.ModifierLike> | undefined): boolean {
  if (!modifiers) return false;
  return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}
