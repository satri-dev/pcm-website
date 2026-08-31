// src/lib/data/placements-page-settings.ts
// Server-side data access for the public /placements page. Uses the Cache
// Components (ISR/PPR) model so this rarely-changing content is served from
// cache instead of hitting MongoDB on every request. Written data is
// invalidated from the admin placements-settings API route via
// revalidateTag(CACHE_TAGS.placementsSettings).
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPlacementsPageSettings } from "@/repositories/placements-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPlacementsSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.placementsSettings);

  return await getPlacementsPageSettings();
}
