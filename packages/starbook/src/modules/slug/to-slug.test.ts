import { describe, expect, it } from 'vitest';
import { toSlug } from './to-slug.js';

describe('toSlug', () => {
  it('lowercases and replaces non-alphanumeric with dashes', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
    expect(toSlug('Forms!')).toBe('forms');
    expect(toSlug('Foo_Bar')).toBe('foo-bar');
  });

  it('returns untitled when nothing meaningful remains', () => {
    expect(toSlug('  ---  ')).toBe('untitled');
    expect(toSlug('')).toBe('untitled');
    expect(toSlug('!!!')).toBe('untitled');
  });

  it('trims edges', () => {
    expect(toSlug('  My Star  ')).toBe('my-star');
  });
});
