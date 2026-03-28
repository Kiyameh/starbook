import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import { afterEach, describe, expect, it } from 'vitest';
import { collectDefaultImports } from './collect-default-imports.js';

describe('collectDefaultImports', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (!tmpDir) return;
    const fs = await import('node:fs/promises');
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = undefined;
  });

  it('maps default import identifiers to resolved absolute paths', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-imports-'));
    const starPath = path.join(tmpDir, 'Button.star.ts');
    await writeFile(starPath, `import Button from './Button.astro';\n`, 'utf-8');

    const sourceFile = ts.createSourceFile(starPath, `import Button from './Button.astro';`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const map = collectDefaultImports(sourceFile, starPath);

    expect(map.get('Button')).toBe(path.join(tmpDir, 'Button.astro'));
  });

  it('ignores namespace and named imports', async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'starbook-imports-'));
    const starPath = path.join(tmpDir, 'X.star.ts');
    await mkdir(path.join(tmpDir, 'sub'), { recursive: true });
    await writeFile(
      starPath,
      `import * as A from './a';\nimport { b } from './b';\nimport C from './C.astro';\n`,
      'utf-8',
    );

    const text = await import('node:fs/promises').then((fs) => fs.readFile(starPath, 'utf-8'));
    const sourceFile = ts.createSourceFile(starPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const map = collectDefaultImports(sourceFile, starPath);

    expect(map.size).toBe(1);
    expect(map.get('C')).toBe(path.join(tmpDir, 'C.astro'));
  });
});
