import { describe, expect, it } from 'vitest';
import type { CatalogDiagnostic } from '../../types/diagnostic.js';
import type { ParsedStarFile } from '../parser/types.js';
import { buildCatalogTree } from './build-catalog-tree.js';

function star(overrides: Partial<ParsedStarFile> & Pick<ParsedStarFile, 'filePath' | 'title' | 'constellation'>): ParsedStarFile {
  return {
    componentPath: '/c.astro',
    phases: [{ name: 'Default', args: {} }],
    ...overrides,
  };
}

describe('buildCatalogTree', () => {
  it('groups stars under normalized constellation slug and sorts', () => {
    const parsed: ParsedStarFile[] = [
      star({
        filePath: '/b.star.ts',
        title: 'Beta',
        constellation: 'Zoo/Animals',
        phases: [{ name: 'Default', args: { x: 1 } }],
      }),
      star({
        filePath: '/a.star.ts',
        title: 'Alpha',
        constellation: 'App/Ui',
        phases: [{ name: 'Default', args: {} }],
      }),
    ];
    const diagnostics: CatalogDiagnostic[] = [];

    const { constellations } = buildCatalogTree(parsed, diagnostics);

    expect(constellations.map((c) => c.slug)).toEqual(['app/ui', 'zoo/animals']);
    expect(constellations[0].stars.map((s) => s.slug)).toEqual(['alpha']);
    expect(constellations[1].stars.map((s) => s.slug)).toEqual(['beta']);
  });

  it('warns when two constellation strings normalize to the same path', () => {
    const parsed: ParsedStarFile[] = [
      star({ filePath: '/1.star.ts', title: 'A', constellation: 'Forms/Main' }),
      star({ filePath: '/2.star.ts', title: 'B', constellation: 'forms/main' }),
    ];
    const diagnostics: CatalogDiagnostic[] = [];

    buildCatalogTree(parsed, diagnostics);

    expect(diagnostics.some((d) => d.type === 'warning' && d.message.includes('normalizes'))).toBe(true);
  });

  it('dedupes star and phase slugs with suffix and emits warnings', () => {
    const parsed: ParsedStarFile[] = [
      star({
        filePath: '/1.star.ts',
        title: 'Same',
        constellation: 'g',
        phases: [
          { name: 'State', args: {} },
          { name: 'State', args: { x: 1 } },
        ],
      }),
      star({ filePath: '/2.star.ts', title: 'Same', constellation: 'g' }),
    ];
    const diagnostics: CatalogDiagnostic[] = [];

    const { constellations } = buildCatalogTree(parsed, diagnostics);

    const stars = constellations[0].stars;
    expect(stars.map((s) => s.slug)).toEqual(['same', 'same-2']);
    expect(diagnostics.some((d) => d.message.includes('Star slug collision'))).toBe(true);

    const phases = stars[0].phases;
    expect(phases.map((p) => p.slug)).toEqual(['state', 'state-2']);
    expect(diagnostics.some((d) => d.message.includes('Phase slug collision'))).toBe(true);
  });
});
