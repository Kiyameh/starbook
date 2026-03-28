/**
 * Builds the `uiverse` rest-param value: constellation segments + star + phase (no leading slash).
 */
export function buildUiversePathParam(
  constellationSlug: string,
  starSlug: string,
  phaseSlug: string,
): string {
  const parts = [...constellationSlug.split('/').filter(Boolean), starSlug, phaseSlug];
  return parts.join('/');
}
