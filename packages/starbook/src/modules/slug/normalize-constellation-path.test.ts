import { describe, expect, it } from 'vitest';
import { normalizeConstellationPath } from './normalize-constellation-path.js';

describe('normalizeConstellationPath', () => {
  it('slugifies path segments', () => {
    expect(normalizeConstellationPath('Components/Forms/Main')).toBe('components/forms/main');
    expect(normalizeConstellationPath('/Components/Brand/Main/')).toBe('components/brand/main');
    expect(normalizeConstellationPath('Forms!')).toBe('forms');
  });

  it('returns uncategorized for empty or junk-only input', () => {
    expect(normalizeConstellationPath('')).toBe('uncategorized');
    expect(normalizeConstellationPath('///')).toBe('uncategorized');
    expect(normalizeConstellationPath('   ')).toBe('uncategorized');
  });

  it('drops segments that become untitled after slugify', () => {
    expect(normalizeConstellationPath('valid/!!!')).toBe('valid');
  });
});
