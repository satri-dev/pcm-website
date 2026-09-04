import type { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";
import {
  getApprovedTestimonials,
  getTestimonialSettings,
} from "@/lib/data/testimonials";

const SITE_NAME = "Pokhara College of Management";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getTestimonialSettings();
  const title = settings.seoTitle;
  const description = settings.seoDescription;
  return {
    title,
    description,
    keywords: settings.seoKeywords,
    alternates: { canonical: settings.canonical },
    robots: {
      index: settings.robotsIndex,
      follow: settings.robotsFollow,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: settings.ogImage ? [{ url: settings.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings.ogImage ? [settings.ogImage] : undefined,
    },
  };
}

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    getApprovedTestimonials(),
    getTestimonialSettings(),
  ]);
  return <TestimonialsClient testimonials={testimonials} settings={settings} />;
}
