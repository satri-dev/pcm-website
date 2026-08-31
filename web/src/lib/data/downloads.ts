// src/lib/data/downloads.ts
// Server-side data access for the public downloads page. Uses the Cache
// Components (ISR/PPR) model so the published file catalogue is served from
// cache instead of hitting MongoDB on every request. Written data is
// invalidated from the admin downloads API routes via revalidateTag.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listDownloads } from "@/repositories/download.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

/** All published downloads, newest first. */
export async function getPublishedDownloads() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.downloads);
  const { items } = await listDownloads({
    status: "published",
    pageSize: 100,
  });
  return items;
}
