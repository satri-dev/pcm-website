import type { Metadata } from "next";
import DownloadsClient from "./DownloadsClient";
import { getPublishedDownloads } from "@/lib/data/downloads";
import { getDownloadsSettings } from "@/lib/data/downloads-page-settings";
import { DOWNLOADS_PAGE_SETTINGS_DEFAULTS } from "@/types/downloads-page-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = {
    ...DOWNLOADS_PAGE_SETTINGS_DEFAULTS,
    ...(await getDownloadsSettings()),
  };
  const title = settings.heroTitle;
  const description = settings.heroSubtitle;

  return {
    title: `${title} | Pokhara College of Management`,
    description,
    keywords: [
      "PCM downloads",
      "PCM prospectus",
      "PCM admission form",
      "BBA syllabus",
      "BCSIT syllabus",
      "scholarship form PCM",
      "Pokhara College of Management forms",
    ],
    openGraph: {
      title: `${title} | Pokhara College of Management`,
      description,
      url: "https://www.pcm.edu.np/downloads",
      images: [
        {
          url: "/assets/img/about-1.jpg",
          width: 1200,
          height: 630,
          alt: "PCM official documents",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Pokhara College of Management`,
      description,
      images: ["/assets/img/about-1.jpg"],
    },
    alternates: {
      canonical: "https://www.pcm.edu.np/downloads",
    },
  };
}

export default async function DownloadsPage() {
  const [items, settings] = await Promise.all([
    getPublishedDownloads(),
    getDownloadsSettings(),
  ]);

  return <DownloadsClient items={items} settings={settings} />;
}
