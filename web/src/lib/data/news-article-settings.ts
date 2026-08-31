// src/lib/data/news-article-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getNewsArticleSettings } from "@/repositories/news-article-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getNewsArticleSettingsCached() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.newsArticleSettings);
  return await getNewsArticleSettings();
}
