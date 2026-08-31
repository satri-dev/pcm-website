import type { Metadata } from "next";
import CareersClient from "./CareersClient";
// Caching is handled by cacheComponents in next.config.ts — no segment config needed.

export const metadata: Metadata = {
  title: "Careers | Pokhara College of Management",
  description:
    "Careers at PCM — current faculty, staff and administrative openings. Join a team that shapes the next generation of Nepal's business and tech leaders.",
  keywords: [
    "PCM careers",
    "faculty jobs PCM",
    "teaching jobs Pokhara",
    "BCSIT faculty",
    "management faculty Nepal",
    "PCM job openings",
  ],
  openGraph: {
    title: "Careers | Pokhara College of Management",
    description:
      "Careers at PCM — current faculty, staff and administrative openings. Join a team that shapes the next generation of Nepal's business and tech leaders.",
    url: "https://www.pcm.edu.np/career",
    images: [
      {
        url: "/assets/img/hero-3.jpg",
        width: 1200,
        height: 630,
        alt: "PCM campus — careers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Pokhara College of Management",
    description:
      "Current faculty, staff and administrative openings at PCM Pokhara. Apply today.",
    images: ["/assets/img/hero-3.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/career",
  },
};

export default function CareerPage() {
  return <CareersClient />;
}
