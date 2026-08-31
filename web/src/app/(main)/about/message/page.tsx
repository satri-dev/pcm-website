import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CtaBand } from "../legacy/cta-band";
import { LeaderList } from "./LeaderList";
import { getPageCopy, getSection } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Words from our leaders | Pokhara College of Management",
  description:
    "Words from our leaders — personal messages from the Principal, Chairperson, Advisor and program coordinators of Pokhara College of Management.",
  alternates: { canonical: "/about/message" },
};

export default async function MessagePage() {
  const content = await getPageCopy("about/message");
  const hero = (content as any)?.hero ?? {
    title: "Words from our leaders",
    subtitle: "A personal welcome from the leadership team at Pokhara College of Management.",
  };
  const intro = await getSection(content, "intro", {
    key: "intro",
    eyebrow: "Leadership voices",
    title: "Words from our leaders",
    subtitle: "The people guiding PCM share why they believe in our mission of affordable, quality education.",
  });
  const cta = await getSection(content, "cta", {
    key: "cta",
    title: "A step towards your future",
    paragraphs: [
      "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    ],
  });

  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Words from our leaders" }]}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <section className="section">
        <div className="wrap-wide">
          <SectionHead
            eyebrow={intro.eyebrow ?? ""}
            title={intro.title ?? "Words from our leaders"}
            subtitle={intro.subtitle}
          />
          <LeaderList />
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
