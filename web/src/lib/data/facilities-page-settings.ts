// src/lib/data/facilities-page-settings.ts
// Server-side data access for the public /about/facility page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getFacilitiesPageSettings } from "@/repositories/facilities-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getFacilitiesSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.facilitiesSettings);

  return await getFacilitiesPageSettings();
}
