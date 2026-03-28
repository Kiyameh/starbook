import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildCatalog } from "./build-catalog.js";
import { PathLike } from "node:fs";

describe("buildCatalog", () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (!tmpDir) return;
    await import("node:fs/promises").then((fs) =>
      fs.rm(tmpDir as PathLike, { recursive: true, force: true }),
    );
    tmpDir = undefined;
  });

  it("scans, parses, and builds catalog from star files on disk", async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), "starbook-catalog-"));
    await writeFile(
      path.join(tmpDir, "One.star.ts"),
      `
import One from './One.astro';
export default {
  component: One,
  constellation: 'widgets',
  title: 'One',
};
export const Default = { args: { n: 1 } };
`,
      "utf-8",
    );
    await mkdir(path.join(tmpDir, "nest"), { recursive: true });
    await writeFile(
      path.join(tmpDir, "nest", "Two.star.ts"),
      `
import Two from '../Two.astro';
export default {
  component: Two,
  constellation: 'widgets',
  title: 'Two',
};
export const Default = { args: {} };
`,
      "utf-8",
    );

    const result = await buildCatalog({ rootDir: tmpDir });

    expect(result.scannedFiles.length).toBe(2);
    expect(result.parsedFiles.sort()).toEqual(result.scannedFiles.sort());
    expect(result.catalog.constellations).toHaveLength(1);
    expect(result.catalog.constellations[0].slug).toBe("widgets");
    expect(
      result.catalog.constellations[0].stars.map((s) => s.title).sort(),
    ).toEqual(["One", "Two"]);
    expect(result.diagnostics.filter((d) => d.type === "error")).toEqual([]);
  });
});
