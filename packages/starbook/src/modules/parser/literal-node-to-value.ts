import ts from 'typescript';

export const NON_SERIALIZABLE_VALUE = Symbol('NON_SERIALIZABLE_VALUE');

export function literalNodeToValue(node: ts.Expression): unknown | typeof NON_SERIALIZABLE_VALUE {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;

  if (ts.isArrayLiteralExpression(node)) {
    const values: unknown[] = [];
    for (const element of node.elements) {
      if (!ts.isExpression(element)) return NON_SERIALIZABLE_VALUE;
      const value = literalNodeToValue(element);
      if (value === NON_SERIALIZABLE_VALUE) return NON_SERIALIZABLE_VALUE;
      values.push(value);
    }
    return values;
  }

  if (ts.isObjectLiteralExpression(node)) {
    const objectValue: Record<string, unknown> = {};

    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) return NON_SERIALIZABLE_VALUE;
      if (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name)) return NON_SERIALIZABLE_VALUE;

      const value = literalNodeToValue(property.initializer);
      if (value === NON_SERIALIZABLE_VALUE) return NON_SERIALIZABLE_VALUE;
      objectValue[property.name.text] = value;
    }

    return objectValue;
  }

  return NON_SERIALIZABLE_VALUE;
}
