import { walkStarFileTree } from "./walk-star-file-tree.js";

const SKIPPED_DIRECTORIES = new Set([
  ".git",
  ".turbo",
  ".next",
  "node_modules",
  "dist",
]);

export async function scanStarFiles(rootDir: string): Promise<string[]> {
  const discoveredFiles: string[] = [];
  await walkStarFileTree(rootDir, discoveredFiles, SKIPPED_DIRECTORIES);
  discoveredFiles.sort((left, right) => left.localeCompare(right));
  return discoveredFiles;
}
