// src/lib/data/blog-article-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getBlogArticleSettings } from "@/repositories/blog-article-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getBlogArticleSettingsCached() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.blogArticleSettings);
  return await getBlogArticleSettings();
}