import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
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

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default async function FacilityPage() {
  const content = await getPageCopy("about/facility");
  const hero = (content as any)?.hero ?? {
    title: "Campus & Facilities",
    subtitle: "Everything a student needs to learn, create and grow — all on one campus at Nadipur.",
  };
  
  const campusSection = await getSection(content, "campus", null);
  const campus = campusSection ?? {
    key: "campus",
    eyebrow: "Our campus",
    title: "Facilities designed around you",
    subtitle: "Modern classrooms, dedicated labs, a rich learning resource centre and space to play and unwind.",
  };
  
  const designedSection = await getSection(content, "designed", null);
  const designed = designedSection ?? {
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
  };
  
  const ctaSection = await getSection(content, "cta", null);
  const cta = ctaSection ?? {
    key: "cta",
    title: "See the campus for yourself",
    paragraphs: [
      "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM.",
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
                <span>Campus & Facilities</span>
              </nav>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
            </div>
          </section>
          <section className="section">
            <div className="wrap-wide">
              <div className="section-head-row">
                <SectionHead
                  eyebrow={campus.eyebrow || ""}
                  title={campus.title || "Facilities designed around you"}
                  subtitle={campus.subtitle || ""}
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
                <span className="eyebrow">{designed.eyebrow || "Designed for learning"}</span>
                <h2 className="section-title">{designed.title || "A campus that feels like home"}</h2>
                {designed.paragraphs && designed.paragraphs[0] && (
                  <p className="mt-4">{designed.paragraphs[0]}</p>
                )}
                {designed.checklist && designed.checklist.length > 0 && (
                  <CheckList
                    className="check-list mt-5"
                    items={designed.checklist}
                  />
                )}
              </RevealBox>
            </div>
          </section>
          <CtaBand
            title={cta.title || "See the campus for yourself"}
            text={cta.paragraphs?.[0] || "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM."}
            primary={{ label: "Apply Now", href: "/admission" }}
            secondary={{ label: "Book a Visit", href: "/contact" }}
          />
        </main>
      </div>
    </div>
  );
}
