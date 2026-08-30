import type { Metadata } from "next";
import ClubsClient from "./ClubsClient";
import { getPageCopy } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Student Clubs | Pokhara College of Management",
  description:
    "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and belong.",
  alternates: { canonical: "/clubs" },
  openGraph: {
    type: "website",
    siteName: "Pokhara College of Management",
    title: "Student Clubs | Pokhara College of Management",
    description:
      "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and belong.",
    locale: "en_US",
    images: [{ url: "/assets/img/about-games.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Clubs | Pokhara College of Management",
    description:
      "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and belong.",
    images: ["/assets/img/about-games.jpg"],
  },
};

export default async function ClubsPage() {
  const content = await getPageCopy("clubs");
  return <ClubsClient content={content} />;
}
