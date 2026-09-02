// src/lib/data/about-page-settings.ts
// Server-side data access for the public /about page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getAboutPageSettings } from "@/repositories/about-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getAboutSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.aboutSettings);

  return await getAboutPageSettings();
}
