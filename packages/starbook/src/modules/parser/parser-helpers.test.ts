import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { getObjectPropertyInitializer } from './get-object-property-initializer.js';
import { getStringLiteralValue } from './get-string-literal-value.js';
import { hasExportModifier } from './has-export-modifier.js';
import { resolveComponentPath } from './resolve-component-path.js';

function objectLiteralFromSource(source: string): ts.ObjectLiteralExpression {
  const wrapped = `const _ = ${source};`;
  const sourceFile = ts.createSourceFile('fixture.ts', wrapped, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const statement = sourceFile.statements[0];
  if (!ts.isVariableStatement(statement)) throw new Error('expected variable statement');
  const init = statement.declarationList.declarations[0].initializer;
  if (!init || !ts.isObjectLiteralExpression(init)) throw new Error('expected object literal');
  return init;
}

describe('getStringLiteralValue', () => {
  it('reads string literals', () => {
    const node = objectLiteralFromSource(`{ x: 'abc' }`);
    const prop = getObjectPropertyInitializer(node, 'x');
    expect(getStringLiteralValue(prop)).toBe('abc');
  });

  it('returns null for missing or non-string nodes', () => {
    const node = objectLiteralFromSource(`{ x: 1 }`);
    const prop = getObjectPropertyInitializer(node, 'x');
    expect(getStringLiteralValue(prop)).toBe(null);
    expect(getStringLiteralValue(null)).toBe(null);
  });
});

describe('getObjectPropertyInitializer', () => {
  it('finds properties by identifier or string name', () => {
    const node = objectLiteralFromSource(`{ a: 1, 'b': 2 }`);
    expect(ts.isNumericLiteral(getObjectPropertyInitializer(node, 'a')!)).toBe(true);
    expect(ts.isNumericLiteral(getObjectPropertyInitializer(node, 'b')!)).toBe(true);
    expect(getObjectPropertyInitializer(node, 'missing')).toBe(null);
  });
});

describe('hasExportModifier', () => {
  it('detects export keyword on variable statements', () => {
    const sourceFile = ts.createSourceFile(
      'fixture.ts',
      `export const A = {}; const B = {};`,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const [exported, plain] = sourceFile.statements;
    expect(hasExportModifier((exported as ts.VariableStatement).modifiers)).toBe(true);
    expect(hasExportModifier((plain as ts.VariableStatement).modifiers)).toBe(false);
    expect(hasExportModifier(undefined)).toBe(false);
  });
});

describe('resolveComponentPath', () => {
  it('resolves identifier against default import map', () => {
    const sourceFile = ts.createSourceFile(
      'fixture.ts',
      `import Btn from './Btn.astro';`,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const imports = new Map([['Btn', '/abs/path/Btn.astro']]);
    const stmt = sourceFile.statements[0];
    if (!ts.isImportDeclaration(stmt) || !stmt.importClause?.name) throw new Error('expected import');
    const id = ts.factory.createIdentifier('Btn');
    expect(resolveComponentPath(id, imports)).toBe('/abs/path/Btn.astro');
    expect(resolveComponentPath(ts.factory.createIdentifier('Missing'), imports)).toBe(null);
    expect(resolveComponentPath(ts.factory.createStringLiteral('x'), imports)).toBe(null);
  });
});
