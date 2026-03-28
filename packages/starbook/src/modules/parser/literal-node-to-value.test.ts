import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { literalNodeToValue, NON_SERIALIZABLE_VALUE } from './literal-node-to-value.js';

function expressionFromSource(expr: string): ts.Expression {
  const source = `const _ = ${expr};`;
  const sourceFile = ts.createSourceFile('fixture.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const statement = sourceFile.statements[0];
  if (!ts.isVariableStatement(statement)) throw new Error('expected variable statement');
  const declaration = statement.declarationList.declarations[0];
  if (!declaration.initializer) throw new Error('expected initializer');
  return declaration.initializer;
}

describe('literalNodeToValue', () => {
  it('maps primitives and nullish', () => {
    expect(literalNodeToValue(expressionFromSource(`'hi'`))).toBe('hi');
    expect(literalNodeToValue(expressionFromSource('`tpl`'))).toBe('tpl');
    expect(literalNodeToValue(expressionFromSource('42'))).toBe(42);
    expect(literalNodeToValue(expressionFromSource('true'))).toBe(true);
    expect(literalNodeToValue(expressionFromSource('false'))).toBe(false);
    expect(literalNodeToValue(expressionFromSource('null'))).toBe(null);
    expect(literalNodeToValue(expressionFromSource('undefined'))).toBe(undefined);
  });

  it('maps nested arrays and objects with identifier keys', () => {
    expect(literalNodeToValue(expressionFromSource('[1, "a"]'))).toEqual([1, 'a']);
    expect(literalNodeToValue(expressionFromSource('{ a: 1, b: "x" }'))).toEqual({ a: 1, b: 'x' });
  });

  it('maps string literal property names', () => {
    expect(literalNodeToValue(expressionFromSource('{ "a-b": 1 }'))).toEqual({ 'a-b': 1 });
  });

  it('returns NON_SERIALIZABLE_VALUE for unsupported expressions', () => {
    expect(literalNodeToValue(expressionFromSource('foo()'))).toBe(NON_SERIALIZABLE_VALUE);
    expect(literalNodeToValue(expressionFromSource('a + 1'))).toBe(NON_SERIALIZABLE_VALUE);
    expect(literalNodeToValue(expressionFromSource('{ ...x }'))).toBe(NON_SERIALIZABLE_VALUE);
  });
});
