// src/lib/data/feedback-page-settings.ts
// Server-side data access for the public /feedback page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getFeedbackPageSettings } from "@/repositories/feedback-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getFeedbackSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.feedbackSettings);

  return await getFeedbackPageSettings();
}
