// src/lib/data/life-page-settings.ts
// Server-side data access for the public /life page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getLifePageSettings } from "@/repositories/life-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getLifeSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.lifeSettings);

  return await getLifePageSettings();
}
