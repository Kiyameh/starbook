import { readdir } from "node:fs/promises";
import path from "node:path";

export async function walkStarFileTree(
  currentDir: string,
  discoveredFiles: string[],
  skippedDirectories: Set<string>,
): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name)) continue;
      await walkStarFileTree(fullPath, discoveredFiles, skippedDirectories);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".star.ts")) continue;
    discoveredFiles.push(fullPath);
  }
}
