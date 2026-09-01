// src/lib/data/careers-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCareersPageSettings } from "@/repositories/careers-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getCareersSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.careersSettings);
  return await getCareersPageSettings();
}
