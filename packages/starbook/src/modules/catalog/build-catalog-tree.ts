import type { CatalogDiagnostic } from '../../types/diagnostic.js';
import type { ParsedStarFile } from '../parser/types.js';
import { createUniqueSlug, normalizeConstellationPath, toSlug } from '../slug/index.js';
import type { CatalogConstellation, CatalogPhase, CatalogStar } from './types.js';

export function buildCatalogTree(
  parsedStars: ParsedStarFile[],
  diagnostics: CatalogDiagnostic[],
): { constellations: CatalogConstellation[] } {
  const constellationsByCanonicalKey = new Map<string, CatalogConstellation>();
  const constellationDisplayNameByCanonicalKey = new Map<string, string>();

  for (const parsedStar of parsedStars) {
    const canonicalConstellationKey = normalizeConstellationPath(parsedStar.constellation);
    let constellation = constellationsByCanonicalKey.get(canonicalConstellationKey);

    if (!constellation) {
      constellation = { name: parsedStar.constellation, slug: canonicalConstellationKey, stars: [] };
      constellationsByCanonicalKey.set(canonicalConstellationKey, constellation);
      constellationDisplayNameByCanonicalKey.set(canonicalConstellationKey, parsedStar.constellation);
    } else {
      const canonicalDisplayName = constellationDisplayNameByCanonicalKey.get(canonicalConstellationKey);
      if (canonicalDisplayName && canonicalDisplayName !== parsedStar.constellation) {
        diagnostics.push({
          type: 'warning',
          filePath: parsedStar.filePath,
          message: `Constellation "${parsedStar.constellation}" normalizes to "${canonicalConstellationKey}" and is grouped under "${canonicalDisplayName}".`,
        });
      }
    }

    const usedStarSlugs = new Set(constellation.stars.map((item) => item.slug));
    const baseStarSlug = toSlug(parsedStar.title);
    const starSlug = createUniqueSlug(parsedStar.title, usedStarSlugs);
    if (baseStarSlug !== starSlug) {
      diagnostics.push({
        type: 'warning',
        filePath: parsedStar.filePath,
        message: `Star slug collision for "${parsedStar.title}".`,
      });
    }

    const phaseSlugSet = new Set<string>();
    const phases: CatalogPhase[] = parsedStar.phases.map((phase) => {
      const basePhaseSlug = toSlug(phase.name);
      const slug = createUniqueSlug(phase.name, phaseSlugSet);
      if (basePhaseSlug !== slug) {
        diagnostics.push({
          type: 'warning',
          filePath: parsedStar.filePath,
          message: `Phase slug collision for "${phase.name}" in star "${parsedStar.title}".`,
        });
      }
      return { name: phase.name, slug, args: phase.args };
    });

    const starNode: CatalogStar = {
      title: parsedStar.title,
      slug: starSlug,
      filePath: parsedStar.filePath,
      componentPath: parsedStar.componentPath,
      phases,
    };

    constellation.stars.push(starNode);
  }

  const constellations = [...constellationsByCanonicalKey.values()].sort((left, right) => left.slug.localeCompare(right.slug));
  for (const constellation of constellations) constellation.stars.sort((left, right) => left.slug.localeCompare(right.slug));

  return { constellations };
}
