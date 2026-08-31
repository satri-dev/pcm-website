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
 * @param pageSlugOrContent - Either a page slug string or PageContent object
 * @param sectionKey - The key of the section to retrieve
 * @param fallback - Optional fallback value if section not found
 */
export async function getSection(
  pageSlugOrContent: string | any,
  sectionKey: string,
  fallback?: any
) {
  "use cache";
  cacheLife("content");
  
  let content: any;
  
  // If it's a string, fetch the content; otherwise use the passed object
  if (typeof pageSlugOrContent === 'string') {
    cacheTag(CACHE_TAGS.pageContent(pageSlugOrContent));
    content = await getPageContentBySlug(pageSlugOrContent);
  } else {
    content = pageSlugOrContent;
  }
  
  if (!content?.content?.sections) return fallback || null;
  
  const section = (content.content.sections as any[]).find((s: any) => s.key === sectionKey);
  return section || fallback || null;
}
