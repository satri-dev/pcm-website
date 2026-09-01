// src/lib/data/events-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getEventsPageSettings } from "@/repositories/events-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getEventsSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.eventsSettings);
  return await getEventsPageSettings();
}
