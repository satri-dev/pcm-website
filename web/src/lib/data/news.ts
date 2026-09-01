// src/lib/data/news.ts
// Cached data fetchers for news items from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listNews, getPublishedNewsBySlug } from "@/repositories/news.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedNews() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.newsList);
  const { items } = await listNews({
    status: "published",
    pageSize: 50,
    sort: { publishedAt: -1 },
  });
  return items;
}

export async function getPublishedNewsBySlugCached(slug: string) {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.newsList, CACHE_TAGS.news(slug));
  return getPublishedNewsBySlug(slug);
}
