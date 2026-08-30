// src/lib/data/programs.ts
// Cached data functions for programs collection
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listPrograms } from "@/repositories/programs.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { ListProgramsOptions } from "@/repositories/programs.repository";

/**
 * Get all programs with caching
 * Cache invalidates when any program is created/updated/deleted
 */
export async function getProgramsList(options: ListProgramsOptions = {}) {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.programsList);
  
  return await listPrograms(options);
}

/**
 * Get active programs only (status === "open")
 */
export async function getActivePrograms(options: Omit<ListProgramsOptions, "status"> = {}) {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.programsList);
  
  return await listPrograms({ ...options, status: "open" });
}

/**
 * Get a single program by slug with caching
 * Returns null if program not found
 */
export async function getProgramBySlug(slug: string) {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.programsList); // Use list tag since we're searching all programs
  
  const result = await listPrograms({ pageSize: 100 });
  return result.items.find((p) => p.slug === slug) || null;
}
