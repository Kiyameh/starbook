import { describe, expect, it } from 'vitest';
import type { StarCatalog } from '../catalog/types.js';
import { buildUiversePathParam } from './build-uiverse-path-param.js';
import { listPhaseStaticParams } from './list-phase-static-paths.js';
import { resolveUiversePath } from './resolve-uiverse-path.js';

const sampleCatalog: StarCatalog = {
  constellations: [
    {
      name: 'Components/Forms/Main',
      slug: 'components/forms/main',
      stars: [
        {
          title: 'Demo Button',
          slug: 'demo-button',
          filePath: '/x/DemoButton.star.ts',
          componentPath: '/x/DemoButton.astro',
          phases: [
            { name: 'Default', slug: 'default', args: { label: 'A' } },
            { name: 'Disabled', slug: 'disabled', args: {} },
          ],
        },
      ],
    },
    {
      name: 'widgets',
      slug: 'widgets',
      stars: [
        {
          title: 'One',
          slug: 'one',
          filePath: '/y/One.star.ts',
          componentPath: '/y/One.astro',
          phases: [{ name: 'Default', slug: 'default', args: {} }],
        },
      ],
    },
  ],
};

describe('resolveUiversePath', () => {
  it('resolves multi-segment constellation + star + phase', () => {
    const param = buildUiversePathParam('components/forms/main', 'demo-button', 'default');
    const r = resolveUiversePath(sampleCatalog, param);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.constellation.slug).toBe('components/forms/main');
    expect(r.value.star.slug).toBe('demo-button');
    expect(r.value.phase.slug).toBe('default');
  });

  it('resolves uncategorized-style single-segment constellation', () => {
    const catalog: StarCatalog = {
      constellations: [
        {
          name: 'x',
          slug: 'uncategorized',
          stars: [
            {
              title: 'S',
              slug: 's',
              filePath: '',
              componentPath: '',
              phases: [{ name: 'P', slug: 'p', args: {} }],
            },
          ],
        },
      ],
    };
    const r = resolveUiversePath(catalog, 'uncategorized/s/p');
    expect(r.ok).toBe(true);
  });

  it('returns too_short when fewer than 3 segments', () => {
    expect(resolveUiversePath(sampleCatalog, 'a/b').ok).toBe(false);
  });

  it('returns empty for undefined param', () => {
    expect(resolveUiversePath(sampleCatalog, undefined).ok).toBe(false);
  });

  it('returns not_found for unknown slug', () => {
    expect(resolveUiversePath(sampleCatalog, 'components/forms/main/demo-button/nope').ok).toBe(
      false,
    );
  });
});

describe('listPhaseStaticParams + round-trip', () => {
  it('every listed param resolves', () => {
    for (const { uiverse } of listPhaseStaticParams(sampleCatalog)) {
      expect(resolveUiversePath(sampleCatalog, uiverse).ok).toBe(true);
    }
  });
});
