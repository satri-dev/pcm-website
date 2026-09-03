// src/lib/data/clubs-page-settings.ts
// Server-side data access for the public /clubs page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getClubsPageSettings } from "@/repositories/clubs-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getClubsSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.clubsSettings);

  return await getClubsPageSettings();
}
