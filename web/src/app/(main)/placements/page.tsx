import type { Metadata } from "next";
import PlacementsClient from "./PlacementsClient";
// Caching is handled by cacheComponents in next.config.ts — no segment config needed.

export const metadata: Metadata = {
  title: "Placements & Careers | Pokhara College of Management",
  description:
    "Career & placement support at PCM — recruitment partners, internship opportunities, career guidance and 90% placement rate for BBA, BBA-Finance and BCSIT graduates.",
  keywords: [
    "PCM placements",
    "Pokhara College of Management careers",
    "BBA placement Nepal",
    "BCSIT jobs Nepal",
    "PCM internship",
    "campus recruitment Pokhara",
  ],
  openGraph: {
    title: "Placements & Careers | Pokhara College of Management",
    description:
      "Career & placement support at PCM — recruitment partners, internship opportunities, career guidance and 90% placement rate for BBA, BBA-Finance and BCSIT graduates.",
    url: "https://www.pcm.edu.np/placements",
    images: [
      {
        url: "/assets/img/about-graduation.jpg",
        width: 1200,
        height: 630,
        alt: "PCM graduation ceremony",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Placements & Careers | Pokhara College of Management",
    description:
      "90% placement rate, 50+ hiring partners and dedicated career guidance at PCM Pokhara.",
    images: ["/assets/img/about-graduation.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/placements",
  },
};

export default function PlacementsPage() {
  return <PlacementsClient />;
}
