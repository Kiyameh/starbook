import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { readPhases } from './read-phases.js';

const filePath = path.join('/tmp', 'Fixture.star.ts');

function parsePhases(source: string) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return readPhases(sourceFile, filePath);
}

describe('readPhases', () => {
  it('collects exported object phases with args', () => {
    const source = `
export const Default = {
  args: { label: 'Save', nested: { a: 1 } },
};
export const Disabled = {
  args: { disabled: true, items: [1, 2] },
};
`;
    const { value, diagnostics } = parsePhases(source);
    expect(diagnostics).toEqual([]);
    expect(value).toEqual([
      { name: 'Default', args: { label: 'Save', nested: { a: 1 } } },
      { name: 'Disabled', args: { disabled: true, items: [1, 2] } },
    ]);
  });

  it('skips phases without args property', () => {
    const source = `export const NoArgs = { other: 1 };`;
    const { value } = parsePhases(source);
    expect(value).toEqual([]);
  });

  it('reports error for non-serializable args', () => {
    const source = `export const Bad = { args: foo() };`;
    const { value, diagnostics } = parsePhases(source);
    expect(value).toEqual([]);
    expect(diagnostics.some((d) => d.message.includes('not supported literal'))).toBe(true);
  });

  it('reports duplicate phase names', () => {
    const source = `
export const Same = { args: { a: 1 } };
export const Same = { args: { b: 2 } };
`;
    const { value, diagnostics } = parsePhases(source);
    expect(value.length).toBe(1);
    expect(diagnostics.some((d) => d.message.includes('duplicated'))).toBe(true);
  });
});
