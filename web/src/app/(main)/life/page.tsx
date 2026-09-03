import type { Metadata } from "next";
import LifeClient from "./LifeClient";
import { getLifeSettings } from "@/lib/data/life-page-settings";
import { getLifeGalleryPhotos } from "@/lib/data/life-gallery";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getLifeSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: "/life" },
    openGraph: {
      type: "website",
      siteName: "Pokhara College of Management",
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: "https://www.pcm.edu.np/life",
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

export default async function LifePage() {
  const [settings, gallery] = await Promise.all([
    getLifeSettings(),
    getLifeGalleryPhotos(4),
  ]);
  return <LifeClient settings={settings} gallery={gallery} />;
}
