import type { StarCatalog } from '../catalog/types.js';
import { buildUiversePathParam } from './build-uiverse-path-param.js';

/** Params for `getStaticPaths` on the `[...uiverse]` route. */
export function listPhaseStaticParams(catalog: StarCatalog): { uiverse: string }[] {
  const params: { uiverse: string }[] = [];
  for (const constellation of catalog.constellations) {
    for (const star of constellation.stars) {
      for (const phase of star.phases) {
        params.push({
          uiverse: buildUiversePathParam(constellation.slug, star.slug, phase.slug),
        });
      }
    }
  }
  return params;
}
