import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { BoardCard } from "./BoardCard";
import { boardMembers } from "./data";

export const metadata: Metadata = {
  title: "Board of Directors | Pokhara College of Management",
  description:
    "Meet the Board of Directors of Pokhara College of Management — the leadership guiding our vision, governance and growth since 2002.",
  alternates: { canonical: "/about/board" },
};

export default function BoardPage() {
  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Board of Directors" }]}
        title="Board of Directors"
        subtitle="The people steering PCM — guiding vision, governance and growth since 2002."
      />
      <section className="section">
        <div className="wrap-wide">
          <SectionHead
            eyebrow="Governance"
            title="Our Board of Directors"
            subtitle="A committed leadership team that keeps PCM rooted in quality, integrity and service."
          />
          <div className="grid g-3" style={{ marginTop: "2rem" }}>
            {boardMembers.map((member, i) => (
              <BoardCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>
      <section className="section tone-sky">
        <div className="wrap-wide split">
          <RevealBox>
            <span className="eyebrow">Our promise</span>
            <h2 className="section-title">Governance rooted in student success</h2>
            <p style={{ marginTop: "1rem" }}>
              Every decision at PCM flows from one question: how do we best serve our students? The
              board works closely with faculty, guardians and industry partners to keep our programs
              relevant, our campus supportive and our graduates ready for the world.
            </p>
            <CheckList
              className="checklist"
              items={[
                "Regular curriculum reviews aligned with Pokhara University",
                "Transparent, merit-based scholarship and admission policies",
                "Investment in faculty, facilities and student experience",
              ]}
            />
          </RevealBox>
          <RevealBox className="split__media">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <img className="split-media-img" src="/assets/img/about-1.jpg" alt="The PCM campus in Nadipur" loading="lazy" />
            </div>
            <div className="est-badge">
              <b>2002</b>
              <span>Established</span>
            </div>
          </RevealBox>
        </div>
      </section>
      <CtaBand
        title="A step towards your future"
        text="Applications for the 2083 intake are open across all three programs. Take the first step today."
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "Explore Programs", href: "/programs.html" }}
      />
    </main>
  );
}
