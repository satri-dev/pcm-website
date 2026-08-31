import type { Metadata } from "next";
import VirtualTourClient from "./VirtualTourClient";
// Caching is handled by cacheComponents in next.config.ts — no segment config needed.

export const metadata: Metadata = {
  title: "Virtual Tour | Pokhara College of Management",
  description:
    "Take a virtual tour of the PCM campus in Nadipur, Pokhara — smart classrooms, IT labs, library, seminar hall, sports ground and more.",
  keywords: [
    "PCM virtual tour",
    "PCM campus Nadipur",
    "Pokhara College of Management facilities",
    "PCM campus tour",
    "PCM IT labs",
    "PCM library",
  ],
  openGraph: {
    title: "Virtual Tour | Pokhara College of Management",
    description:
      "Take a virtual tour of the PCM campus in Nadipur, Pokhara — smart classrooms, IT labs, library, seminar hall, sports ground and more.",
    url: "https://www.pcm.edu.np/virtual-tour",
    images: [
      {
        url: "/assets/img/hero-4.jpg",
        width: 1200,
        height: 630,
        alt: "PCM campus virtual tour",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Tour | Pokhara College of Management",
    description:
      "Explore PCM's campus in Nadipur, Pokhara — classrooms, IT labs, library and more.",
    images: ["/assets/img/hero-4.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/virtual-tour",
  },
};

export default function VirtualTourPage() {
  return <VirtualTourClient />;
}
