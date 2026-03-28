import { toSlug } from './to-slug.js';

/**
 * Normalizes a constellation logical path: trims, splits on `/`, slugifies each segment,
 * and drops segments that become empty after slugification. Empty or junk-only strings become `uncategorized`.
 *
 * @example Input → output
 * ```ts
 * normalizeConstellationPath('Components/Forms/Main'); // 'components/forms/main'
 * normalizeConstellationPath('/Components/Brand/Main/'); // 'components/brand/main'
 * normalizeConstellationPath('Forms!'); // 'forms'
 * normalizeConstellationPath(''); // 'uncategorized'
 * normalizeConstellationPath('///'); // 'uncategorized'
 * ```
 */
export function normalizeConstellationPath(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (!trimmed) return 'uncategorized';

  const normalized = trimmed
    .split('/')
    .map((segment) => toSlug(segment))
    .filter((segment) => segment !== 'untitled')
    .join('/');

  if (normalized) return normalized;
  return 'uncategorized';
}
