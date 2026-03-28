import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parseStarFile } from './parse-star-file.js';

describe('parseStarFile', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (!tmpDir) return;
    await import('node:fs/promises').then((fs) => fs.rm(tmpDir, { recursive: true, force: true }));
    tmpDir = undefined;
  });

  it('parses a valid star file on disk', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-parse-'));
    const starPath = path.join(tmpDir, 'Demo.star.ts');
    const source = `
import Demo from './Demo.astro';

export default {
  component: Demo,
  constellation: 'components/forms/main',
  title: 'Demo Button',
};

export const Default = {
  args: {
    label: 'Save',
    variant: 'primary',
  },
};

export const Disabled = {
  args: {
    label: 'Save',
    disabled: true,
  },
};
`;
    await writeFile(starPath, source, 'utf-8');

    const result = await parseStarFile(starPath);

    expect(result.parsedStar).not.toBeNull();
    expect(result.parsedStar?.title).toBe('Demo Button');
    expect(result.parsedStar?.constellation).toBe('components/forms/main');
    expect(result.parsedStar?.componentPath).toBe(path.join(tmpDir, 'Demo.astro'));
    expect(result.parsedStar?.phases.map((p) => p.name)).toEqual(['Default', 'Disabled']);
    expect(result.diagnostics.filter((d) => d.type === 'error')).toEqual([]);
  });

  it('returns null and error when no valid phases exist', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-parse-'));
    const starPath = path.join(tmpDir, 'Empty.star.ts');
    const source = `
import X from './X.astro';
export default {
  component: X,
  constellation: 'a',
  title: 'T',
};
`;
    await writeFile(starPath, source, 'utf-8');

    const result = await parseStarFile(starPath);

    expect(result.parsedStar).toBeNull();
    expect(result.diagnostics.some((d) => d.message.includes('no valid exported phases'))).toBe(true);
  });

  it('merges diagnostics from metadata and phases', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-parse-'));
    const starPath = path.join(tmpDir, 'Bad.star.ts');
    const source = `export default { component: 1, constellation: 'c', title: 't' }; export const P = { args: {} };`;
    await writeFile(starPath, source, 'utf-8');

    const result = await parseStarFile(starPath);

    expect(result.parsedStar).toBeNull();
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });
});
