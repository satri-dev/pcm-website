// src/lib/data/results-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getResultsPageSettings } from "@/repositories/results-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getResultsSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.resultsSettings);
  return await getResultsPageSettings();
}
