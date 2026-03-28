import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { scanStarFiles } from './scan-star-files.js';
import { walkStarFileTree } from './walk-star-file-tree.js';

describe('walkStarFileTree', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (!tmpDir) return;
    await import('node:fs/promises').then((fs) => fs.rm(tmpDir, { recursive: true, force: true }));
    tmpDir = undefined;
  });

  it('collects .star.ts files recursively and skips configured directories', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-walk-'));
    await writeFile(path.join(tmpDir, 'Root.star.ts'), '', 'utf-8');
    await mkdir(path.join(tmpDir, 'deep'), { recursive: true });
    await writeFile(path.join(tmpDir, 'deep', 'Inner.star.ts'), '', 'utf-8');
    await mkdir(path.join(tmpDir, 'node_modules'), { recursive: true });
    await writeFile(path.join(tmpDir, 'node_modules', 'Ignored.star.ts'), '', 'utf-8');

    const discovered: string[] = [];
    const skipped = new Set(['node_modules']);
    await walkStarFileTree(tmpDir, discovered, skipped);

    expect(discovered).toHaveLength(2);
    expect(discovered).toContain(path.join(tmpDir, 'Root.star.ts'));
    expect(discovered).toContain(path.join(tmpDir, 'deep', 'Inner.star.ts'));
  });
});

describe('scanStarFiles', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (!tmpDir) return;
    await import('node:fs/promises').then((fs) => fs.rm(tmpDir, { recursive: true, force: true }));
    tmpDir = undefined;
  });

  it('returns sorted absolute paths to star files', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-scan-'));
    await writeFile(path.join(tmpDir, 'Z.star.ts'), '', 'utf-8');
    await mkdir(path.join(tmpDir, 'a'), { recursive: true });
    await writeFile(path.join(tmpDir, 'a', 'M.star.ts'), '', 'utf-8');

    const files = await scanStarFiles(tmpDir);

    expect(files).toEqual([...files].sort((a, b) => a.localeCompare(b)));
    expect(files).toContain(path.join(tmpDir, 'Z.star.ts'));
    expect(files).toContain(path.join(tmpDir, 'a', 'M.star.ts'));
  });

  it('ignores built-in skipped directories', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-scan-'));
    await writeFile(path.join(tmpDir, 'Keep.star.ts'), '', 'utf-8');
    await mkdir(path.join(tmpDir, 'dist'), { recursive: true });
    await writeFile(path.join(tmpDir, 'dist', 'Build.star.ts'), '', 'utf-8');

    const files = await scanStarFiles(tmpDir);

    expect(files).toEqual([path.join(tmpDir, 'Keep.star.ts')]);
  });
});
