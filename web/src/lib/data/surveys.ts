// src/lib/data/surveys.ts
// Cached data fetchers for surveys from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listSurveys, getPublishedSurveyBySlug } from "@/repositories/surveys.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedSurveys() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.surveysList);
  const { items } = await listSurveys({
    status: "published",
    pageSize: 50,
    sort: { createdAt: -1 },
  });
  return items;
}

export async function getPublishedSurveysPage(page: number, pageSize: number) {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.surveysList);
  const result = await listSurveys({
    status: "published",
    page: Math.max(1, page),
    pageSize: Math.max(1, pageSize),
    sort: { createdAt: -1 },
  });
  return result;
}

export async function getPublishedSurveyBySlugCached(slug: string) {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.surveysList, CACHE_TAGS.survey(slug));
  return getPublishedSurveyBySlug(slug);
}