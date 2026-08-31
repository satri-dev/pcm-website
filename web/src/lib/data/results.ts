// src/lib/data/results.ts
// Cached data fetcher for results items from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listResults } from "@/repositories/results.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedResults() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.resultsList);
  const { items } = await listResults({
    status: "published",
    pageSize: 50,
    sort: { date: -1 },
  });
  return items;
}
