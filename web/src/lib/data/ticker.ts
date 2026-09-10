// src/lib/data/ticker.ts
// Cached data fetcher for the announcement ticker.
// Aggregates the latest 3 published items from News, Notices, and Events.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listNews } from "@/repositories/news.repository";
import { listNotices } from "@/repositories/notices.repository";
import { listEvents } from "@/repositories/events.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export interface TickerItem {
  id: string;
  title: string;
  href: string;
  category: "News" | "Notice" | "Event";
}

export async function getTickerItems(): Promise<TickerItem[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.tickerItems);

  const [newsResult, noticesResult, eventsResult] = await Promise.all([
    listNews({ status: "published", pageSize: 3, sort: { publishedAt: -1 } }),
    listNotices({ status: "published", pageSize: 3, sort: { date: -1 } }),
    listEvents({ status: "published", pageSize: 3, sort: { date: -1 } }),
  ]);

  const newsItems: TickerItem[] = newsResult.items.map((n) => ({
    id: n.id,
    title: n.title,
    href: `/news/${n.slug}`,
    category: "News" as const,
  }));

  const noticeItems: TickerItem[] = noticesResult.items.map((n) => ({
    id: n.id,
    title: n.title,
    href: "/notices",
    category: "Notice" as const,
  }));

  const eventItems: TickerItem[] = eventsResult.items.map((e) => ({
    id: e.id,
    title: e.title,
    href: "/events",
    category: "Event" as const,
  }));

  return [...newsItems, ...noticeItems, ...eventItems];
}
