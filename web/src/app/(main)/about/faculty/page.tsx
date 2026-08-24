import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CtaBand } from "../legacy/cta-band";
import { FacultyCard } from "./FacultyCard";
import { StatsGrid } from "./StatsGrid";
import { leadership, team, stats } from "./data";

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
      <section className="section">
        <div className="wrap-wide">
          <SectionHead eyebrow="Leadership" title="Guiding PCM" />
          <div className="grid g-4" style={{ marginTop: "2rem" }}>
            {leadership.map((person, i) => (
              <FacultyCard key={person.name} person={person} index={i} />
            ))}
          </div>
        </div>
      </section>
      <section className="section tone-sky">
        <div className="wrap-wide">
          <SectionHead eyebrow="Our team" title="Faculty & administration" />
          <div className="grid g-4" style={{ marginTop: "2rem" }}>
            {team.map((person, i) => (
              <FacultyCard key={person.name} person={person} index={i % 4} />
            ))}
          </div>
        </div>
      </section>
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
