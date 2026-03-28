const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASHES_REGEX = /^-+|-+$/g;

/**
 * Turns arbitrary text into a stable slug: lowercase, `-` separators, and no stray non-alphanumeric characters at the edges.
 * If nothing remains after normalization, returns `untitled`.
 *
 * @example Input → output
 * ```ts
 * toSlug('Hello World'); // 'hello-world'
 * toSlug('Forms!'); // 'forms'
 * toSlug('Foo_Bar'); // 'foo-bar'
 * toSlug('  ---  '); // 'untitled'
 * ```
 */
export function toSlug(value: string): string {
  const normalized = value.trim().toLowerCase().replace(NON_ALPHANUMERIC_REGEX, '-').replace(EDGE_DASHES_REGEX, '');
  if (normalized) return normalized;
  return 'untitled';
}
