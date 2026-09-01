import type { Metadata } from "next";
import { getCareersSettings } from "@/lib/data/careers-page-settings";
import CareersClient from "./CareersClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCareersSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: "https://www.pcm.edu.np/career",
      images: [
        {
          url: settings.ogImage || "/assets/img/hero-3.jpg",
          width: 1200,
          height: 630,
          alt: "PCM campus — careers",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.ogImage || "/assets/img/hero-3.jpg"],
    },
    alternates: {
      canonical: "https://www.pcm.edu.np/career",
    },
  };
}

export default async function CareerPage() {
  const settings = await getCareersSettings();
  return <CareersClient settings={settings} />;
}
