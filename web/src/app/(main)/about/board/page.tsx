import type { Metadata } from "next";
import { Suspense } from "react";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { BoardGrid } from "./BoardGrid";
import { getPageCopy } from "@/lib/data/page-content";
import type { PageContentSection } from "@/types/page-content";

const FALLBACK_HERO = {
  title: "Board of Directors",
  subtitle:
    "The people steering PCM — guiding vision, governance and growth since 2002.",
};

export const metadata: Metadata = {
  title: "Board of Directors | Pokhara College of Management",
  description:
    "Meet the Board of Directors of Pokhara College of Management — the leadership guiding our vision, governance and growth since 2002.",
  alternates: { canonical: "/about/board" },
};

function hasContent(section: PageContentSection): boolean {
  return Boolean(
    section.eyebrow?.trim() ||
    section.title?.trim() ||
    section.subtitle?.trim() ||
    (section.paragraphs?.length ?? 0) > 0 ||
    (section.checklist?.length ?? 0) > 0,
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoardPageContent />
    </Suspense>
  );
}

async function BoardPageContent() {
  const content = await getPageCopy("about/board");

  const hero = {
    title: content?.hero?.title?.trim() || FALLBACK_HERO.title,
    subtitle: content?.hero?.subtitle?.trim() || FALLBACK_HERO.subtitle,
  };

  const sections = (content?.sections ?? []).filter(hasContent);

  const intro = sections[0];
  const rest = sections.slice(1);
  const cta = rest.find((s) => s.key === "cta") ?? rest[rest.length - 1];
  const bodySections = cta ? rest.filter((s) => s !== cta) : rest;

  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Board of Directors" }]}
        title={hero.title}
        subtitle={hero.subtitle}
      />

      <section className="section">
        <div className="wrap-wide">
          {intro ? (
            <SectionHead
              eyebrow={intro.eyebrow ?? ""}
              title={intro.title ?? ""}
              subtitle={intro.subtitle}
            />
          ) : (
            <SectionHead
              eyebrow="Governance"
              title="Our Board of Directors"
              subtitle="A committed leadership team that keeps PCM rooted in quality, integrity and service."
            />
          )}
          <BoardGrid />
          {intro?.paragraphs ? (
            <div className="split" style={{ marginTop: "1.6rem" }}>
              <RevealBox>
                {intro.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    style={i === 0 ? { marginTop: "1rem" } : undefined}
                  >
                    {p}
                  </p>
                ))}
                {intro.checklist ? (
                  <CheckList className="checklist" items={intro.checklist} />
                ) : null}
              </RevealBox>
            </div>
          ) : null}
        </div>
      </section>

      {bodySections.map((section, i) => (
        <section
          key={section.key || i}
          className={i % 2 === 1 ? "section tone-sky" : "section"}
        >
          <div className="wrap-wide">
            <SectionHead
              eyebrow={section.eyebrow ?? ""}
              title={section.title ?? ""}
              subtitle={section.subtitle}
              center
            />
            {section.paragraphs ? (
              <div className="split" style={{ marginTop: "1.4rem" }}>
                <RevealBox>
                  {section.paragraphs.map((p, pi) => (
                    <p
                      key={pi}
                      style={pi === 0 ? { marginTop: "1rem" } : undefined}
                    >
                      {p}
                    </p>
                  ))}
                  {section.checklist ? (
                    <CheckList
                      className="checklist"
                      items={section.checklist}
                    />
                  ) : null}
                </RevealBox>
              </div>
            ) : null}
          </div>
        </section>
      ))}

      <CtaBand
        title={cta?.title ?? "A step towards your future"}
        text={
          cta?.paragraphs?.[0] ??
          "Applications for the 2083 intake are open across all three programs. Take the first step today."
        }
        primary={{ label: "Apply Now", href: "/admission" }}
        secondary={{ label: "Explore Programs", href: "/programs" }}
      />
    </main>
  );
}
