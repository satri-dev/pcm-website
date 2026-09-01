// src/lib/data/news-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getNewsPageSettings } from "@/repositories/news-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getNewsSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.newsSettings);
  return await getNewsPageSettings();
}
