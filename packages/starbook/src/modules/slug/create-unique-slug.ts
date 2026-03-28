import { toSlug } from './to-slug.js';

/**
 * Derives a slug from `rawValue` and registers it in `usedSlugs`. If the base slug is already taken,
 * appends `-2`, `-3`, and so on until a free slug is found (the set is mutated).
 *
 * @example Input → output (`usedSlugs` accumulates taken slugs)
 * ```ts
 * const used = new Set<string>();
 * createUniqueSlug('My Button', used); // 'my-button', used = Set { 'my-button' }
 * createUniqueSlug('My Button', used); // 'my-button-2', used = Set { 'my-button', 'my-button-2' }
 * createUniqueSlug('Other!!!', used); // 'other', used = Set { ..., 'other' }
 * ```
 */
export function createUniqueSlug(rawValue: string, usedSlugs: Set<string>): string {
  const baseSlug = toSlug(rawValue);
  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug);
    return baseSlug;
  }

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;

  while (usedSlugs.has(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  usedSlugs.add(candidate);
  return candidate;
}
