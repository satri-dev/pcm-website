// src/lib/data/scholarship-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getScholarshipPageSettings } from "@/repositories/scholarship-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getScholarshipSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.scholarshipPageSettings);
  return await getScholarshipPageSettings();
}
