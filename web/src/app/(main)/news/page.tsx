import type { Metadata } from "next";
import { getNewsSettings } from "@/lib/data/news-page-settings";
import NewsServer from "./NewsServer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getNewsSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: "/news" },
  };
}

export default function NewsPage() {
  return <NewsServer />;
}
