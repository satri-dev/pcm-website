import type { Metadata } from "next";
import ClubsClient from "./ClubsClient";
import { getClubsSettings } from "@/lib/data/clubs-page-settings";
import { getPublishedClubs } from "@/lib/data/clubs";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClubsSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: "/clubs" },
    openGraph: {
      type: "website",
      siteName: "Pokhara College of Management",
      title: settings.seoTitle,
      description: settings.seoDescription,
      locale: "en_US",
      images: [{ url: settings.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.ogImage],
    },
  };
}

export default async function ClubsPage() {
  const [settings, clubs] = await Promise.all([
    getClubsSettings(),
    getPublishedClubs(),
  ]);
  return <ClubsClient settings={settings} clubs={clubs} />;
}
