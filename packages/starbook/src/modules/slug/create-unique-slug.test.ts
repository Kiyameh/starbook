import { describe, expect, it } from 'vitest';
import { createUniqueSlug } from './create-unique-slug.js';

describe('createUniqueSlug', () => {
  it('uses base slug when free and registers it', () => {
    const used = new Set<string>();
    expect(createUniqueSlug('My Button', used)).toBe('my-button');
    expect(used.has('my-button')).toBe(true);
  });

  it('appends numeric suffix on collision', () => {
    const used = new Set<string>(['my-button']);
    expect(createUniqueSlug('My Button', used)).toBe('my-button-2');
    expect(createUniqueSlug('My Button', used)).toBe('my-button-3');
    expect(used.has('my-button-2')).toBe(true);
    expect(used.has('my-button-3')).toBe(true);
  });

  it('handles slugified collisions for noisy titles', () => {
    const used = new Set<string>();
    expect(createUniqueSlug('Other!!!', used)).toBe('other');
  });
});
