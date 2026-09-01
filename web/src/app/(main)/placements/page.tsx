import type { Metadata } from "next";
import { getPlacementsSettings } from "@/lib/data/placements-page-settings";
import PlacementsServer from "./PlacementsServer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPlacementsSettings();

  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: "https://www.pcm.edu.np/placements",
      images: [
        {
          url: settings.ogImage,
          width: 1200,
          height: 630,
          alt: settings.heroTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.ogImage],
    },
    alternates: {
      canonical: "https://www.pcm.edu.np/placements",
    },
  };
}

export default function PlacementsPage() {
  return <PlacementsServer />;
}
