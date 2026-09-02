// src/lib/data/faculty-page-settings.ts
// Server-side data access for the public /about/faculty page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getFacultyPageSettings } from "@/repositories/faculty-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getFacultySettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.facultySettings);

  return await getFacultyPageSettings();
}
