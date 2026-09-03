// src/lib/data/survey-page-settings.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getSurveyPageSettings } from "@/repositories/survey-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getSurveySettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.surveysSettings);
  return await getSurveyPageSettings();
}
