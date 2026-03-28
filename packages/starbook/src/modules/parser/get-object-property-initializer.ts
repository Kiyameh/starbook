import ts from 'typescript';

export function getObjectPropertyInitializer(objectNode: ts.ObjectLiteralExpression, name: string): ts.Expression | null {
  for (const property of objectNode.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    if (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name)) continue;
    if (property.name.text !== name) continue;
    return property.initializer;
  }

  return null;
}
