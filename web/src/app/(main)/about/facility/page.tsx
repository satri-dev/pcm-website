import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { ArrowRightIcon } from "../legacy/icons";
import { FacilitiesExplorer } from "./FacilitiesExplorer";

export const metadata: Metadata = {
  title: "Campus & Facilities | Pokhara College of Management",
  description:
    "Campus facilities at Pokhara College of Management — smart classrooms, IT labs, library, seminar hall, sports grounds, cafeteria and more at Nadipur, Pokhara.",
  alternates: { canonical: "/about/facility" },
};

export default function FacilityPage() {
  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Campus & Facilities" }]}
        title="Campus & Facilities"
        subtitle="Everything a student needs to learn, create and grow — all on one campus at Nadipur."
      />
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head-row">
            <SectionHead
              eyebrow="Our campus"
              title="Facilities designed around you"
              subtitle="Modern classrooms, dedicated labs, a rich learning resource centre and space to play and unwind."
            />
            <a className="btn btn-ghost reveal is-inview" href="/about/campus-map">
              View campus map <ArrowRightIcon />
            </a>
          </div>
          <FacilitiesExplorer />
        </div>
      </section>
      <section className="section section--soft">
        <div className="wrap-wide split">
          <RevealBox className="split__media">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <img src="/assets/img/about-1.jpg" alt="PCM learning resource centre" loading="lazy" />
            </div>
            <div className="est-badge">
              <b>2</b>
              <span>Buildings</span>
            </div>
          </RevealBox>
          <RevealBox className="split__content">
            <span className="eyebrow">Designed for learning</span>
            <h2 className="section-title">A campus that feels like home</h2>
            <p className="mt-4">
              From quiet study corners in the learning resource centre to buzzing group-work zones,
              the PCM campus supports every kind of learner. High-speed internet, comfortable
              classrooms and welcoming open spaces make long study days easy.
            </p>
            <CheckList
              className="check-list mt-5"
              items={[
                "Smart classrooms with modern projectors and AV",
                "Dedicated IT labs for BCSIT practicals",
                "24/7 high-speed campus Wi-Fi",
                "Safe, shaded outdoor spaces for breaks and sports",
              ]}
            />
          </RevealBox>
        </div>
      </section>
      <CtaBand
        title="See the campus for yourself"
        text="Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM."
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "Book a Visit", href: "/contact.html" }}
      />
    </main>
  );
}
