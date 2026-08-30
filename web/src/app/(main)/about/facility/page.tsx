import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { ArrowRightIcon } from "../legacy/icons";
import { FacilitiesExplorer } from "./FacilitiesExplorer";
import { getPageCopy, getSection } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Campus & Facilities | Pokhara College of Management",
  description:
    "Campus facilities at Pokhara College of Management — smart classrooms, IT labs, library, seminar hall, sports grounds, cafeteria and more at Nadipur, Pokhara.",
  alternates: { canonical: "/about/facility" },
};

export default async function FacilityPage() {
  const content = await getPageCopy("about/facility");
  const hero = content?.hero ?? {
    title: "Campus & Facilities",
    subtitle: "Everything a student needs to learn, create and grow — all on one campus at Nadipur.",
  };
  const campus = getSection(content, "campus", {
    key: "campus",
    eyebrow: "Our campus",
    title: "Facilities designed around you",
    subtitle: "Modern classrooms, dedicated labs, a rich learning resource centre and space to play and unwind.",
  });
  const designed = getSection(content, "designed", {
    key: "designed",
    eyebrow: "Designed for learning",
    title: "A campus that feels like home",
    paragraphs: [
      "From quiet study corners in the learning resource centre to buzzing group-work zones, the PCM campus supports every kind of learner. High-speed internet, comfortable classrooms and welcoming open spaces make long study days easy.",
    ],
    checklist: [
      "Smart classrooms with modern projectors and AV",
      "Dedicated IT labs for BCSIT practicals",
      "24/7 high-speed campus Wi-Fi",
      "Safe, shaded outdoor spaces for breaks and sports",
    ],
  });
  const cta = getSection(content, "cta", {
    key: "cta",
    title: "See the campus for yourself",
    paragraphs: [
      "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM.",
    ],
  });

  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Campus & Facilities" }]}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head-row">
            <SectionHead
              eyebrow={campus.eyebrow ?? ""}
              title={campus.title ?? "Facilities designed around you"}
              subtitle={campus.subtitle}
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
            <span className="eyebrow">{designed.eyebrow}</span>
            <h2 className="section-title">{designed.title}</h2>
            <p className="mt-4">{designed.paragraphs?.[0]}</p>
            <CheckList
              className="check-list mt-5"
              items={designed.checklist ?? []}
            />
          </RevealBox>
        </div>
      </section>
      <CtaBand
        title={cta.title ?? "See the campus for yourself"}
        text={cta.paragraphs?.[0] ?? "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM."}
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "Book a Visit", href: "/contact.html" }}
      />
    </main>
  );
}
