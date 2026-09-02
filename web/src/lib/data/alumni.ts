// src/lib/data/alumni.ts
// Cached data fetchers for alumni records from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listAlumni } from "@/repositories/alumni.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedAlumni() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.alumniList);
  const { items } = await listAlumni({ pageSize: 50 });
  return items;
}