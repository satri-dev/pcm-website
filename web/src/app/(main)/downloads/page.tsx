import type { Metadata } from "next";
import DownloadsClient from "./DownloadsClient";
// Caching is handled by cacheComponents in next.config.ts — no segment config needed.
// When the backend is connected, use unstable_cacheLife("frequent") inside the component.

export const metadata: Metadata = {
  title: "Downloads | Pokhara College of Management",
  description:
    "Download official PCM documents — prospectus, admission forms, BBA and BCSIT syllabi, and scholarship application forms for the 2083 intake.",
  keywords: [
    "PCM downloads",
    "PCM prospectus 2083",
    "PCM admission form",
    "BBA syllabus",
    "BCSIT syllabus",
    "scholarship form PCM",
    "Pokhara College of Management forms",
  ],
  openGraph: {
    title: "Downloads | Pokhara College of Management",
    description:
      "Official documents for PCM admissions — prospectus, forms and syllabi for the 2083 intake.",
    url: "https://www.pcm.edu.np/downloads",
    images: [
      {
        url: "/assets/img/about-1.jpg",
        width: 1200,
        height: 630,
        alt: "PCM official documents",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Downloads | Pokhara College of Management",
    description:
      "Download PCM prospectus, admission forms, syllabi and scholarship forms.",
    images: ["/assets/img/about-1.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/downloads",
  },
};

export default function DownloadsPage() {
  return <DownloadsClient />;
}
