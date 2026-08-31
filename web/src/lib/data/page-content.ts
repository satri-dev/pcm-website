// src/lib/data/page-content.ts
// Cached data functions for page_content collection
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPageContentBySlug } from "@/repositories/page-content.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Get page content by slug with caching
 * Cache invalidates only when this specific page's content is updated
 */
export async function getPageContent(slug: string) {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.pageContent(slug));
  
  return await getPageContentBySlug(slug);
}

/**
 * Alias for getPageContent - for backward compatibility
 */
export async function getPageCopy(slug: string) {
  return await getPageContent(slug);
}

/**
 * Get a specific section from page content by section key
 */
export async function getSection(pageSlug: string, sectionKey: string) {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.pageContent(pageSlug));
  
  const content = await getPageContentBySlug(pageSlug);
  if (!content?.content?.sections) return null;
  
  return (content.content.sections as any[]).find((s: any) => s.key === sectionKey) || null;
}
