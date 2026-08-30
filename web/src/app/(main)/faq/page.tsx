import type { Metadata } from "next";
import Script from "next/script";
import FaqClient from "./FaqClient";
import { faqItems } from "@/feature/faq/data/faq";
// Caching is handled by cacheComponents in next.config.ts — no segment config needed.

export const metadata: Metadata = {
  title: "FAQ | Pokhara College of Management",
  description:
    "Answers to the most common questions about PCM — programmes, admission requirements, scholarships, GPA calculation, campus life and contact details.",
  keywords: [
    "PCM FAQ",
    "Pokhara College of Management admissions",
    "BBA BCSIT eligibility",
    "PCM scholarships",
    "PCM entrance exam",
    "Pokhara University programmes",
  ],
  openGraph: {
    title: "FAQ | Pokhara College of Management",
    description:
      "Answers to common questions about programmes, admissions, scholarships, and campus life at PCM, Pokhara.",
    url: "https://www.pcm.edu.np/faq",
    images: [
      {
        url: "/assets/img/about-2.jpg",
        width: 1200,
        height: 630,
        alt: "PCM campus",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Pokhara College of Management",
    description:
      "Answers to common questions about programmes, admissions and scholarships at PCM.",
    images: ["/assets/img/about-2.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/faq",
  },
};

/* ── Schema.org FAQPage JSON-LD ── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}
