import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Campus Gallery | Pokhara College of Management",
  description:
    "Explore the campus gallery of Pokhara College of Management — annual fests, sports, tours, seminars and everyday student life at PCM in Pokhara.",
  keywords: [
    "PCM gallery",
    "Pokhara College of Management photos",
    "PCM campus life",
    "PCM events",
    "PCM Pokhara",
  ],
  openGraph: {
    title: "Campus Gallery | Pokhara College of Management",
    description:
      "Explore the campus gallery of Pokhara College of Management — annual fests, sports, tours, seminars and everyday student life at PCM in Pokhara.",
    url: "https://www.pcm.edu.np/gallery",
    images: [{ url: "/assets/img/about-2.jpg", width: 1200, height: 630, alt: "PCM campus gallery" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Gallery | Pokhara College of Management",
    description:
      "Explore the campus gallery of Pokhara College of Management.",
    images: ["/assets/img/about-2.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/gallery",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
