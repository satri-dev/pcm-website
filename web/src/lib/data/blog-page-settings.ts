// src/lib/data/blog-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getBlogPageSettings } from "@/repositories/blog-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getBlogSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.blogSettings);

  return await getBlogPageSettings();
}