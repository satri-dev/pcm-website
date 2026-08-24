import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { ArrowRightIcon } from "../legacy/icons";
import { CampusMapExplorer } from "./CampusMapExplorer";

export const metadata: Metadata = {
  title: "Campus Map | Pokhara College of Management",
  description:
    "Interactive campus map of Pokhara College of Management at Nadipur — find the main building, library, IT labs, seminar hall, sports ground and more.",
  alternates: { canonical: "/about/campus-map" },
};

export default function CampusMapPage() {
  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Campus Map" }]}
        title="Campus Map"
        subtitle="Find your way around the PCM campus — tap a marker to see what's nearby."
      />
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head-row">
            <SectionHead
              eyebrow="Getting around"
              title="Explore the Nadipur campus"
              subtitle="Click a marker on the map or a place in the list to learn more about each spot."
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
            <span className="eyebrow">Location</span>
            <h2 className="section-title">Easy to reach, hard to leave</h2>
            <p className="mt-4">
              The PCM campus sits on Gyan Marg at Nadipur — a short ride from Pokhara's Lakeside and
              Buses Park, with easy access from every part of the city.
            </p>
            <CheckList
              className="check-list mt-5"
              items={[
                "10 minutes from Lakeside by vehicle",
                "Close to Pokhara Buses Park and public transport",
                "Safe neighbourhood with parking nearby",
              ]}
            />
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
        title="Come visit us at Nadipur"
        text="Drop by the campus for a tour, or talk to our admissions team about joining the 2083 intake."
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "Contact Us", href: "/contact.html" }}
      />
    </main>
  );
}
