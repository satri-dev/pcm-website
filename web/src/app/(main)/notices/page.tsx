import type { Metadata } from "next";
import { getNoticesSettings } from "@/lib/data/notices-page-settings";
import NoticesServer from "./NoticesServer";
import { getCanonicalUrl } from "@/lib/seo-utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getNoticesSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: getCanonicalUrl("/notices") },
  };
}

export default function NoticesPage() {
  return <NoticesServer />;
}
