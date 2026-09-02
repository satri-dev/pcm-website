import type { Metadata } from "next";
import { getAlumniSettings } from "@/lib/data/alumni-page-settings";
import AlumniServer from "./AlumniServer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAlumniSettings();
  const canonical = "https://www.pcm.edu.np/alumni";
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical },
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

export default function AlumniPage() {
  return <AlumniServer />;
}