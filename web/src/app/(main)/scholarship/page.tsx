import type { Metadata } from "next";
import { getScholarshipSettings } from "@/lib/data/scholarship-page-settings";
import { getPublishedScholarships } from "@/lib/data/scholarships";
import ScholarshipClient from "./ScholarshipClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getScholarshipSettings();
  const canonical = "https://www.pcm.edu.np/scholarship";
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: canonical,
      images: [
        {
          url: settings.ogImage,
          width: 1200,
          height: 630,
          alt: "PCM graduation ceremony — scholarship recipients",
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
    alternates: { canonical },
  };
}

export default async function ScholarshipPage() {
  const [settings, scholarships] = await Promise.all([
    getScholarshipSettings(),
    getPublishedScholarships(),
  ]);
  return <ScholarshipClient settings={settings} scholarships={scholarships} />;
}
