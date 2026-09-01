import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
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

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageCopy("about/board");
  const title = [
    content?.hero?.title?.trim() || content?.label?.trim() || "Board of Directors",
    "Pokhara College of Management",
  ]
    .filter(Boolean)
    .join(" | ");
  const description =
    content?.hero?.subtitle?.trim() ||
    "Meet the Board of Directors of Pokhara College of Management — the leadership guiding our vision, governance and growth since 2002.";
  return {
    title,
    description,
    alternates: { canonical: "/about/board" },
  };
}

function hasContent(section: PageContentSection): boolean {
  return Boolean(
    section.eyebrow?.trim() ||
      section.title?.trim() ||
      section.subtitle?.trim() ||
      (section.paragraphs?.length ?? 0) > 0 ||
      (section.checklist?.length ?? 0) > 0
  );
}

export default async function BoardPage() {
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
                <span>Board of Directors</span>
              </nav>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
            </div>
          </section>

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
                      <p key={i} style={i === 0 ? { marginTop: "1rem" } : undefined}>
                        {p}
                      </p>
                    ))}
                    {intro.checklist ? <CheckList className="checklist" items={intro.checklist} /> : null}
                  </RevealBox>
                </div>
              ) : null}
            </div>
          </section>

          {bodySections.map((section, i) => (
            <section key={section.key || i} className={i % 2 === 1 ? "section tone-sky" : "section"}>
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
                        <p key={pi} style={pi === 0 ? { marginTop: "1rem" } : undefined}>
                          {p}
                        </p>
                      ))}
                      {section.checklist ? <CheckList className="checklist" items={section.checklist} /> : null}
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
      </div>
    </div>
  );
}
