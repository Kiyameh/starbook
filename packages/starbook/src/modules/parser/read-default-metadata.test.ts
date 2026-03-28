import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { collectDefaultImports } from './collect-default-imports.js';
import { readDefaultMetadata } from './read-default-metadata.js';

const filePath = path.join('/tmp', 'Fixture.star.ts');

function parseSource(source: string) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const defaultImports = collectDefaultImports(sourceFile, filePath);
  return readDefaultMetadata(sourceFile, filePath, defaultImports);
}

describe('readDefaultMetadata', () => {
  it('reads component, constellation, and title from default export object', () => {
    const source = `
import Btn from './Btn.astro';
export default {
  component: Btn,
  constellation: 'components/forms',
  title: 'Button',
};
export const Default = { args: {} };
`;
    const { value, diagnostics } = parseSource(source);
    expect(diagnostics.filter((d) => d.type === 'error')).toEqual([]);
    expect(value).toEqual({
      componentPath: path.join('/tmp', 'Btn.astro'),
      constellation: 'components/forms',
      title: 'Button',
    });
  });

  it('errors when default export is missing', () => {
    const { value, diagnostics } = parseSource(`export const X = {};`);
    expect(value).toBe(null);
    expect(diagnostics.some((d) => d.message.includes('Missing default export'))).toBe(true);
  });

  it('errors when default export is not an object literal', () => {
    const { value, diagnostics } = parseSource(`export default 42;`);
    expect(value).toBe(null);
    expect(diagnostics.some((d) => d.message.includes('object literal'))).toBe(true);
  });

  it('errors when required fields are missing or wrong type', () => {
    const source = `
import Btn from './Btn.astro';
export default {
  component: Btn,
  constellation: 1,
  title: 'T',
};
`;
    const { value, diagnostics } = parseSource(source);
    expect(value).toBe(null);
    expect(diagnostics.some((d) => d.message.includes('constellation'))).toBe(true);
  });
});
