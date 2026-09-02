// src/lib/data/alumni-page-settings.ts
// Server-side data access for the public /alumni page. Uses the Cache
// Components (ISR/PPR) model so this rarely-changing content is served from
// cache instead of hitting MongoDB on every request. Written data is
// invalidated from the admin alumni-settings API route via
// revalidateTag(CACHE_TAGS.alumniSettings).
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getAlumniPageSettings } from "@/repositories/alumni-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getAlumniSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.alumniSettings);

  return await getAlumniPageSettings();
}