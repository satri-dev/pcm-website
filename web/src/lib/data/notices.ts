// src/lib/data/notices.ts
// Cached data fetcher for notices items from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listNotices } from "@/repositories/notices.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedNotices() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.noticesList);
  const { items } = await listNotices({
    status: "published",
    pageSize: 50,
    sort: { date: -1 },
  });
  return items;
}
