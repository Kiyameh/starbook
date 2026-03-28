import type { CatalogConstellation, CatalogPhase, CatalogStar, StarCatalog } from '../catalog/types.js';

export interface ResolvedUiversePhase {
  constellation: CatalogConstellation;
  star: CatalogStar;
  phase: CatalogPhase;
}

export type ResolveUiversePathResult =
  | { ok: true; value: ResolvedUiversePhase }
  | { ok: false; reason: 'empty' | 'too_short' | 'not_found' };

export function parseUiverseUrlParam(uiverseParam: string | undefined): string[] | null {
  if (uiverseParam == null || uiverseParam === '') return null;
  const segments = uiverseParam.split('/').filter(Boolean);
  return segments.length ? segments : null;
}

export function resolveUiversePath(
  catalog: StarCatalog,
  uiverseParam: string | undefined,
): ResolveUiversePathResult {
  const segments = parseUiverseUrlParam(uiverseParam);
  if (segments === null) return { ok: false, reason: 'empty' };
  if (segments.length < 3) return { ok: false, reason: 'too_short' };

  const phaseSlug = segments[segments.length - 1]!;
  const starSlug = segments[segments.length - 2]!;
  const constellationSlug = segments.slice(0, -2).join('/');

  const constellation = catalog.constellations.find((c) => c.slug === constellationSlug);
  if (!constellation) return { ok: false, reason: 'not_found' };

  const star = constellation.stars.find((s) => s.slug === starSlug);
  if (!star) return { ok: false, reason: 'not_found' };

  const phase = star.phases.find((p) => p.slug === phaseSlug);
  if (!phase) return { ok: false, reason: 'not_found' };

  return { ok: true, value: { constellation, star, phase } };
}
