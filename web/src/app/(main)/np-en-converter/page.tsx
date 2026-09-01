import type { Metadata } from "next";
import NpEnClient from "./NpEnClient";

export const metadata: Metadata = {
  title: "Nepali ⇌ English Converter | Pokhara College of Management",
  description:
    "Transliterate between Nepali (Devanagari) script and romanized English instantly using ITRANS-style romanization. Bidirectional, free, no login required.",
  keywords: [
    "Nepali to English converter",
    "English to Nepali converter",
    "Devanagari romanization",
    "ITRANS Nepali",
    "PCM tools",
    "Pokhara College of Management",
  ],
  openGraph: {
    title: "Nepali ⇌ English Converter | PCM",
    description:
      "Free bidirectional Nepali–English transliterator using ITRANS romanization. Type in Devanagari or Roman and the other updates live.",
    url: "https://www.pcm.edu.np/np-en-converter",
    images: [{ url: "/assets/img/hero-2.jpg", width: 1200, height: 630, alt: "PCM NP-EN Converter" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepali ⇌ English Converter | PCM",
    description: "Instant, free Nepali–English transliterator.",
    images: ["/assets/img/hero-2.jpg"],
  },
  alternates: { canonical: "https://www.pcm.edu.np/np-en-converter" },
};

export default function NpEnConverterPage() {
  return <NpEnClient />;
}
