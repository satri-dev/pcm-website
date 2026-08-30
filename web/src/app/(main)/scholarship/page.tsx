import type { Metadata } from "next";
import ScholarshipClient from "./ScholarshipClient";
// Caching is handled by cacheComponents in next.config.ts — no segment config needed.

export const metadata: Metadata = {
  title: "Scholarships | Pokhara College of Management",
  description:
    "PCM offers merit-based, Pokhara University, need-based and category scholarships. Learn how to apply and get financial support for your BBA or BCSIT studies.",
  keywords: [
    "PCM scholarships",
    "Pokhara College of Management financial aid",
    "merit scholarship BBA",
    "BCSIT scholarship Nepal",
    "Pokhara University scholarship",
    "need-based scholarship PCM",
  ],
  openGraph: {
    title: "Scholarships | Pokhara College of Management",
    description:
      "Explore merit, PU, need-based and category scholarships available to PCM students in Pokhara.",
    url: "https://www.pcm.edu.np/scholarship",
    images: [
      {
        url: "/assets/img/about-graduation.jpg",
        width: 1200,
        height: 630,
        alt: "PCM graduation ceremony — scholarship recipients",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scholarships | Pokhara College of Management",
    description:
      "Merit, PU and need-based scholarships available at PCM. Apply today.",
    images: ["/assets/img/about-graduation.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/scholarship",
  },
};

export default function ScholarshipPage() {
  return <ScholarshipClient />;
}
