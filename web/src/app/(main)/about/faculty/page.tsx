import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { CtaBand } from "../legacy/cta-band";
import { FacultyGrid } from "./FacultyGrid";
import { StatsGrid } from "./StatsGrid";
import { stats } from "./data";

export const metadata: Metadata = {
  title: "Staff & Faculty | Pokhara College of Management",
  description: "Meet the faculty and staff of Pokhara College of Management.",
  alternates: { canonical: "/about/faculty" },
};

export default function FacultyPage() {
  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Staff & Faculty" }]}
        title="Staff & Faculty"
        subtitle="The dedicated people behind PCM — qualified, experienced and genuinely invested in your success."
      />
      <FacultyGrid />
      <StatsGrid stats={stats} />
      <CtaBand
        title="Join a college that cares"
        text="Experience the PCM difference for yourself — apply for the 2083 intake today."
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "More Info", href: "/about.html" }}
      />
    </main>
  );
}
