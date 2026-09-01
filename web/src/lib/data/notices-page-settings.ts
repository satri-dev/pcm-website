// src/lib/data/notices-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getNoticesPageSettings } from "@/repositories/notices-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getNoticesSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.noticesSettings);
  return await getNoticesPageSettings();
}
