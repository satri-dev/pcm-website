import type { Metadata } from "next";
import FeedbackClient from "./FeedbackClient";
import { getFeedbackSettings } from "@/lib/data/feedback-page-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getFeedbackSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: "https://www.pcm.edu.np/feedback",
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: "PCM Feedback" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.ogImage],
    },
    alternates: { canonical: "https://www.pcm.edu.np/feedback" },
  };
}

export default async function FeedbackPage() {
  const settings = await getFeedbackSettings();
  return <FeedbackClient settings={settings} />;
}
