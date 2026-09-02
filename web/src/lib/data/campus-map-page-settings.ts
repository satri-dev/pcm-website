// src/lib/data/campus-map-page-settings.ts
// Server-side data access for the public /about/campus-map page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCampusMapPageSettings } from "@/repositories/campus-map-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getCampusMapSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.campusMapSettings);

  return await getCampusMapPageSettings();
}
