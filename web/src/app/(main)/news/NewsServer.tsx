import { getNewsSettings } from "@/lib/data/news-page-settings";
import { getPublishedNews } from "@/lib/data/news";
import { getPublishedNotices } from "@/lib/data/notices";
import NewsClient from "./NewsClient";

export default async function NewsServer() {
  const [settings, newsItems, notices] = await Promise.all([
    getNewsSettings(),
    getPublishedNews(),
    getPublishedNotices(),
  ]);
  return <NewsClient settings={settings} newsItems={newsItems} notices={notices} />;
}
