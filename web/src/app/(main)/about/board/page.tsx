import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { BoardGrid } from "./BoardGrid";
import { getPageCopy, getSection } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Board of Directors | Pokhara College of Management",
  description:
    "Meet the Board of Directors of Pokhara College of Management — the leadership guiding our vision, governance and growth since 2002.",
  alternates: { canonical: "/about/board" },
};

export default async function BoardPage() {
  const content = await getPageCopy("about/board");
  const hero = content?.hero ?? {
    title: "Board of Directors",
    subtitle: "The people steering PCM — guiding vision, governance and growth since 2002.",
  };
  const intro = getSection(content, "intro", {
    key: "intro",
    eyebrow: "Governance",
    title: "Our Board of Directors",
    subtitle: "A committed leadership team that keeps PCM rooted in quality, integrity and service.",
  });
  const promise = getSection(content, "promise", {
    key: "promise",
    eyebrow: "Our promise",
    title: "Governance rooted in student success",
    paragraphs: [
      "Every decision at PCM flows from one question: how do we best serve our students? The board works closely with faculty, guardians and industry partners to keep our programs relevant, our campus supportive and our graduates ready for the world.",
    ],
    checklist: [
      "Regular curriculum reviews aligned with Pokhara University",
      "Transparent, merit-based scholarship and admission policies",
      "Investment in faculty, facilities and student experience",
    ],
  });
  const cta = getSection(content, "cta", {
    key: "cta",
    title: "A step towards your future",
    paragraphs: [
      "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    ],
  });

  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Board of Directors" }]}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <section className="section">
        <div className="wrap-wide">
          <SectionHead
            eyebrow={intro.eyebrow ?? ""}
            title={intro.title ?? "Our Board of Directors"}
            subtitle={intro.subtitle}
          />
          <BoardGrid />
        </div>
      </section>
      <section className="section tone-sky">
        <div className="wrap-wide split">
          <RevealBox>
            <span className="eyebrow">{promise.eyebrow}</span>
            <h2 className="section-title">{promise.title}</h2>
            <p style={{ marginTop: "1rem" }}>{promise.paragraphs?.[0]}</p>
            <CheckList
              className="checklist"
              items={promise.checklist ?? []}
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
        title={cta.title ?? "A step towards your future"}
        text={cta.paragraphs?.[0] ?? "Applications for the 2083 intake are open across all three programs. Take the first step today."}
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "Explore Programs", href: "/programs.html" }}
      />
    </main>
  );
}
