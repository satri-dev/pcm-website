import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
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

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default async function FacultyPage() {
  const content = await getPageCopy("about/faculty");
  const hero = (content as any)?.hero ?? {
    title: "Staff & Faculty",
    subtitle: "The dedicated people behind PCM — qualified, experienced and genuinely invested in your success.",
  };
  
  const statsSection = await getSection(content, "stats", null);
  const statsContent = statsSection ?? {
    key: "stats",
    eyebrow: "By the numbers",
    title: "A legacy measured in outcomes",
  };
  
  const ctaSection = await getSection(content, "cta", null);
  const cta = ctaSection ?? {
    key: "cta",
    title: "Join a college that cares",
    paragraphs: [
      "Experience the PCM difference for yourself — apply for the 2083 intake today.",
    ],
  };

  return (
    <div className={poppins.variable}>
      <div className="pcm-about">
        <main id="main">
          <section className="page-hero">
            <svg
              className="page-hero__peaks"
              viewBox="0 0 1440 400"
              preserveAspectRatio="xMidYMax slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
              <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
            </svg>
            <div className="wrap-wide page-hero__inner">
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
                <Link href="/about">About</Link>{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
                <span>Staff & Faculty</span>
              </nav>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
            </div>
          </section>
          <FacultyGrid />
          <StatsGrid
            stats={stats}
            eyebrow={statsContent.eyebrow || "By the numbers"}
            title={statsContent.title || "A legacy measured in outcomes"}
          />
          <CtaBand
            title={cta.title || "Join a college that cares"}
            text={cta.paragraphs?.[0] || "Experience the PCM difference for yourself — apply for the 2083 intake today."}
            primary={{ label: "Apply Now", href: "/admission" }}
            secondary={{ label: "More Info", href: "/about" }}
          />
        </main>
      </div>
    </div>
  );
}
