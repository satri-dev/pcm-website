// src/core/lib/page-count.ts

import "server-only";

import {
  Dirent,
  readdirSync,
  realpathSync,
  statSync,
} from "node:fs";
import path from "node:path";

/**
 * File names recognized as Next.js App Router page entry points.
 *
 * If your project standard is strictly TypeScript, you can reduce this
 * to ["page.tsx", "page.ts"].
 */
const PAGE_FILES = new Set([
  "page.tsx",
  "page.ts",
  "page.jsx",
  "page.js",
]);

/**
 * Route segments that should never be considered public website pages.
 *
 * Keep this list limited to application-level private areas.
 *
 * Route groups such as "(main)" or "(public)" are NOT included here
 * because they don't represent URL segments and should be traversed.
 */
const EXCLUDED_SEGMENTS = new Set([
  "admin",
  "api",
  "seed-admin",
  "enable-2fa",
]);

/**
 * Special Next.js route conventions.
 *
 * These folders can contain pages, but their page.tsx is not necessarily
 * a normal public URL by itself.
 */
const NON_PAGE_SEGMENTS = new Set([
  "_private",
]);

/**
 * Returns true when a directory name is a Next.js route group.
 *
 * Examples:
 *   (main)
 *   (public)
 *   (auth)
 *   (marketing)
 */
function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")");
}

/**
 * Returns true for parallel route segments.
 *
 * Examples:
 *   @modal
 *   @dashboard
 */
function isParallelRoute(segment: string): boolean {
  return segment.startsWith("@");
}

/**
 * Returns true for Next.js private folders.
 *
 * Example:
 *   _components
 *   _lib
 */
function isPrivateFolder(segment: string): boolean {
  return segment.startsWith("_");
}

/**
 * Determines whether a directory should be traversed.
 */
function shouldTraverseDirectory(segment: string): boolean {
  // Explicitly excluded application areas.
  if (EXCLUDED_SEGMENTS.has(segment)) {
    return false;
  }

  // Internal/private folders should not contribute routes.
  if (NON_PAGE_SEGMENTS.has(segment)) {
    return false;
  }

  /*
   * Private folders beginning with "_" are not route segments.
   * There is no reason to scan them for public page entry points.
   */
  if (isPrivateFolder(segment)) {
    return false;
  }

  /*
   * Route groups ARE traversed because:
   *
   * src/app/(main)/about/page.tsx
   *
   * is still the public /about route.
   */
  if (isRouteGroup(segment)) {
    return true;
  }

  /*
   * Parallel routes (@modal etc.) are intentionally ignored.
   * Their page.tsx is not a standalone public URL.
   */
  if (isParallelRoute(segment)) {
    return false;
  }

  return true;
}

/**
 * Resolves the Next.js App Router directory.
 *
 * Supports both common project structures:
 *
 *   src/app
 *   app
 *
 * Preference is given to src/app.
 */
function resolveAppDirectory(): string | null {
  const projectRoot = process.cwd();

  const candidates = [
    path.join(projectRoot, "src", "app"),
    path.join(projectRoot, "app"),
  ];

  for (const directory of candidates) {
    try {
      if (statSync(directory).isDirectory()) {
        return realpathSync(directory);
      }
    } catch {
      // Directory does not exist or cannot be accessed.
    }
  }

  return null;
}

/**
 * Counts public Next.js App Router page entry points.
 *
 * Important:
 * This counts ROUTE DEFINITIONS, not database-generated URLs.
 *
 * Example:
 *
 *   app/news/[slug]/page.tsx
 *
 * counts as 1 route even if the database contains 500 news articles.
 */
export function countPublicPages(): number {
  const appDirectory = resolveAppDirectory();

  if (!appDirectory) {
    return 0;
  }

  let count = 0;

  /**
   * Iterative traversal avoids deep recursive call stacks on
   * unusually large projects.
   */
  const directoriesToVisit: string[] = [appDirectory];

  /**
   * Prevents accidentally traversing the same physical directory
   * more than once when symlinks are present.
   */
  const visitedDirectories = new Set<string>();

  while (directoriesToVisit.length > 0) {
    const currentDirectory = directoriesToVisit.pop();

    if (!currentDirectory) {
      continue;
    }

    let realDirectory: string;

    try {
      realDirectory = realpathSync(currentDirectory);
    } catch {
      continue;
    }

    if (visitedDirectories.has(realDirectory)) {
      continue;
    }

    visitedDirectories.add(realDirectory);

    let entries: Dirent[];

    try {
      entries = readdirSync(realDirectory, {
        withFileTypes: true,
      });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const entryName = entry.name;

      /*
       * Count only Next.js page entry files.
       */
      if (entry.isFile() && PAGE_FILES.has(entryName)) {
        count += 1;
        continue;
      }

      /*
       * Only traverse directories that can contain public routes.
       */
      if (!entry.isDirectory()) {
        continue;
      }

      if (!shouldTraverseDirectory(entryName)) {
        continue;
      }

      directoriesToVisit.push(
        path.join(realDirectory, entryName),
      );
    }
  }

  return count;
}

/**
 * Returns useful information for dashboard/debugging purposes.
 *
 * This is optional but useful if you later want to display:
 *
 *   Total Pages: 24
 *   Source: src/app
 */
export function getPublicPageStats() {
  const appDirectory = resolveAppDirectory();

  return {
    totalPages: countPublicPages(),
    appDirectory,
  };
}
