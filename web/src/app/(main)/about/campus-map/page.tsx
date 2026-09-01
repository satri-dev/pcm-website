import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { ArrowRightIcon } from "../legacy/icons";
import { CampusMapExplorer } from "./CampusMapExplorer";
import { getPageCopy, getSection } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Campus Map | Pokhara College of Management",
  description:
    "Interactive campus map of Pokhara College of Management at Nadipur — find the main building, library, IT labs, seminar hall, sports ground and more.",
  alternates: { canonical: "/about/campus-map" },
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default async function CampusMapPage() {
  const content = await getPageCopy("about/campus-map");
  const hero = (content as any)?.hero ?? {
    title: "Campus Map",
    subtitle: "Find your way around the PCM campus — tap a marker to see what's nearby.",
  };
  
  // Get sections without fallbacks first, then apply defaults only if section doesn't exist
  const exploreSection = await getSection(content, "explore", null);
  const explore = exploreSection ?? {
    key: "explore",
    eyebrow: "Getting around",
    title: "Explore the Nadipur campus",
    subtitle: "Click a marker on the map or a place in the list to learn more about each spot.",
  };
  
  const locationSection = await getSection(content, "location", null);
  const location = locationSection ?? {
    key: "location",
    eyebrow: "Location",
    title: "Easy to reach, hard to leave",
    paragraphs: [
      "The PCM campus sits on Gyan Marg at Nadipur — a short ride from Pokhara's Lakeside and Buses Park, with easy access from every part of the city.",
    ],
    checklist: [
      "10 minutes from Lakeside by vehicle",
      "Close to Pokhara Buses Park and public transport",
      "Safe neighbourhood with parking nearby",
    ],
  };
  
  const ctaSection = await getSection(content, "cta", null);
  const cta = ctaSection ?? {
    key: "cta",
    title: "Come visit us at Nadipur",
    paragraphs: [
      "Drop by the campus for a tour, or talk to our admissions team about joining the 2083 intake.",
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
                <span>Campus Map</span>
              </nav>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
            </div>
          </section>
          <section className="section">
            <div className="wrap-wide">
              <div className="section-head-row">
                <SectionHead
                  eyebrow={explore.eyebrow || ""}
                  title={explore.title || "Explore the Nadipur campus"}
                  subtitle={explore.subtitle || ""}
                />
                <a className="btn btn-ghost reveal is-inview" href="/about/facility">
                  Browse facilities <ArrowRightIcon />
                </a>
              </div>
              <CampusMapExplorer />
            </div>
          </section>
          <section className="section section--soft">
            <div className="wrap-wide split">
              <RevealBox className="split__media">
                <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
                  <img src="/assets/img/about-2.jpg" alt="PCM campus at Nadipur, Pokhara" loading="lazy" />
                </div>
                <div className="est-badge">
                  <b>PU</b>
                  <span>Affiliated</span>
                </div>
              </RevealBox>
              <RevealBox className="split__content">
                <span className="eyebrow">{location.eyebrow || "Location"}</span>
                <h2 className="section-title">{location.title || "Easy to reach, hard to leave"}</h2>
                {location.paragraphs && location.paragraphs[0] && (
                  <p className="mt-4">{location.paragraphs[0]}</p>
                )}
                {location.checklist && location.checklist.length > 0 && (
                  <CheckList
                    className="check-list mt-5"
                    items={location.checklist}
                  />
                )}
                <a
                  className="btn btn-primary mt-6"
                  href="https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur"
                  target="_blank"
                  rel="noopener"
                >
                  Get Directions <ArrowRightIcon />
                </a>
              </RevealBox>
            </div>
          </section>
          <CtaBand
            title={cta.title || "Come visit us at Nadipur"}
            text={cta.paragraphs?.[0] || "Drop by the campus for a tour, or talk to our admissions team about joining the 2083 intake."}
            primary={{ label: "Apply Now", href: "/admission" }}
            secondary={{ label: "Contact Us", href: "/contact" }}
          />
        </main>
      </div>
    </div>
  );
}
