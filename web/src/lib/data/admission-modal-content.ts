// src/lib/data/admission-modal-content.ts
// Cached data fetcher for the admission modal's latest content feeds.
// Returns the 5 most recent published items from news, notices, results and
// events. Cache tags match the admin revalidation tags so mutations in the
// admin panel invalidate this entry on demand (on top of time-based ISR).
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listNews } from "@/repositories/news.repository";
import { listNotices } from "@/repositories/notices.repository";
import { listResults } from "@/repositories/results.repository";
import { listEvents } from "@/repositories/events.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getAdmissionModalContent() {
  "use cache";
  cacheLife("frequent");
  cacheTag(
    CACHE_TAGS.newsList,
    CACHE_TAGS.noticesList,
    CACHE_TAGS.resultsList,
    CACHE_TAGS.eventsList
  );

  const [news, notices, results, events] = await Promise.all([
    listNews({ status: "published", pageSize: 5, sort: { publishedAt: -1 } }),
    listNotices({ status: "published", pageSize: 5, sort: { date: -1 } }),
    listResults({ status: "published", pageSize: 5, sort: { date: -1 } }),
    listEvents({ status: "published", pageSize: 5, sort: { date: -1 } }),
  ]);

  return {
    news: news.items,
    notices: notices.items,
    results: results.items,
    events: events.items,
  };
}
