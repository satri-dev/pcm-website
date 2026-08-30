import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { CtaBand } from "../legacy/cta-band";
import { FacultyGrid } from "./FacultyGrid";
import { StatsGrid } from "./StatsGrid";
import { stats } from "./data";
import { getPageCopy, getSection } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Staff & Faculty | Pokhara College of Management",
  description: "Meet the faculty and staff of Pokhara College of Management.",
  alternates: { canonical: "/about/faculty" },
};

export default async function FacultyPage() {
  const content = await getPageCopy("about/faculty");
  const hero = content?.hero ?? {
    title: "Staff & Faculty",
    subtitle: "The dedicated people behind PCM — qualified, experienced and genuinely invested in your success.",
  };
  const statsSection = getSection(content, "stats", {
    key: "stats",
    eyebrow: "By the numbers",
    title: "A legacy measured in outcomes",
  });
  const cta = getSection(content, "cta", {
    key: "cta",
    title: "Join a college that cares",
    paragraphs: [
      "Experience the PCM difference for yourself — apply for the 2083 intake today.",
    ],
  });

  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Staff & Faculty" }]}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <FacultyGrid />
      <StatsGrid
        stats={stats}
        eyebrow={statsSection.eyebrow ?? "By the numbers"}
        title={statsSection.title ?? "A legacy measured in outcomes"}
      />
      <CtaBand
        title={cta.title ?? "Join a college that cares"}
        text={cta.paragraphs?.[0] ?? "Experience the PCM difference for yourself — apply for the 2083 intake today."}
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "More Info", href: "/about.html" }}
      />
    </main>
  );
}
