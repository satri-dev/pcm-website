// src/lib/data/downloads-page-settings.ts
// Server-side data access for the public downloads page copy. Uses the Cache
// Components (ISR/PPR) model. Written data is invalidated from the admin
// downloads-settings API route via revalidateTag.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getDownloadsPageSettings } from "@/repositories/downloads-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getDownloadsSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.downloadsSettings);

  return await getDownloadsPageSettings();
}
