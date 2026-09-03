// src/lib/data/message-page-settings.ts
// Server-side data access for the public /about/message page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getMessagePageSettings } from "@/repositories/message-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getMessageSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.messageSettings);

  return await getMessagePageSettings();
}
