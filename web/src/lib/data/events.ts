// src/lib/data/events.ts
// Cached data fetcher for events items from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listEvents } from "@/repositories/events.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedEvents() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.eventsList);
  const { items } = await listEvents({
    status: "published",
    pageSize: 50,
    sort: { date: -1 },
  });
  return items;
}
