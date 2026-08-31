"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./about.css";
import type { PageContentSection } from "@/types/page-content";

// Fallback copy used only when the database has no content yet, so the page
// never looks broken before an admin writes the About copy.
const FALLBACK_HERO = {
  title: "About Pokhara College of Management",
  subtitle:
    "Since 2002, a home for confident, creative and adaptive graduates in the heart of Pokhara.",
};

const FALLBACK_SECTIONS: PageContentSection[] = [
  {
    key: "who-we-are",
    eyebrow: "Who we are",
    title: "Quality management education, made affordable",
    paragraphs: [
      "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to make an impact on an organisation&apos;s strategic capability and competitive advantage.",
      "The PCM team firmly believes that quality management education is the need of the hour, as the world transforms into a common business arena. A business leader must understand the global rules to excel in local fields — and that spirit has guided us from humble beginnings to a college trusted by guardians, students and society alike.",
    ],
  },
  {
    key: "why-pcm",
    eyebrow: "Why study at PCM?",
    title: "A balanced approach to management",
    paragraphs: [
      "The last two decades of change in information technology have brought unprecedented shifts to the business world. Markets are opening, competition is intensifying, and the horizon of management education is ever-evolving.",
      "Through it all, the time-tested values of management remain a guide. Our programs adopt a well-balanced approach — inculcating a strong theoretical concept of management alongside an intense realisation of its practical application in real life.",
    ],
  },
  {
    key: "values",
    eyebrow: "Vision, Mission &amp; Values",
    title: "What we stand for",
    paragraphs: [
      "To identify, develop and unveil the potential of future business leaders who define their own role and boundaries — and grasp the opportunities of a dynamic new world.",
      "A value-based organisation promoting discipline, sincerity, hard work and innovation as individual values, and respect, professionalism, fairness, transparency and team spirit as organisational values.",
      "To offer highly competitive, professionally oriented education — equipping students with advanced conceptual, analytical and quantitative techniques for decision-making.",
    ],
  },
  {
    key: "difference",
    eyebrow: "The PCM difference",
    title: "What makes us different",
    paragraphs: [
      "A dedicated faculty pool with extensive experience across management and IT, guest lectures and workshops, specialised updated IT courses, vibrant extracurriculars, strong industry connections and individual student care.",
    ],
  },
  {
    key: "stats",
    eyebrow: "By the numbers",
    title: "A legacy measured in outcomes",
    paragraphs: [
      "80% success stories, 100+ Dean's List scholars, 1000+ graduates and 23 years of excellence — the outcomes we are most proud of.",
    ],
  },
  {
    key: "achievers",
    eyebrow: "Voices of PCM",
    title: "What our achievers say",
    subtitle:
      "Graduates on the Dean&apos;s List reflect on their four-year journey — the mentorship, the friendships, and the confidence they carry forward.",
  },
  {
    key: "cta",
    eyebrow: "Enter to Learn — Go Forth to Serve",
    title: "A step towards your future",
    paragraphs: [
      "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type AboutClientContent = {
  hero?: { title?: string; subtitle?: string };
  sections?: PageContentSection[] | null;
};

export default function AboutClient({
  content,
}: {
  content: AboutClientContent | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const heroTitle =
    content?.hero?.title?.trim() || FALLBACK_HERO.title;
  const heroSubtitle =
    content?.hero?.subtitle?.trim() || FALLBACK_HERO.subtitle;

  const sections =
    content?.sections?.length
      ? content.sections.filter(
          (s) =>
            s.eyebrow?.trim() ||
            s.title?.trim() ||
            s.subtitle?.trim() ||
            (s.paragraphs?.length ?? 0) > 0 ||
            (s.checklist?.length ?? 0) > 0
        )
      : FALLBACK_SECTIONS;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pcm-about">
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
              <span>About Us</span>
            </nav>
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
          </div>
        </section>

        {sections.map((section, i) => (
          <section key={section.key || `section-${i}`} className={i % 2 === 1 ? "section tone-sky" : "section"}>
            <div className="wrap-wide">
              {section.eyebrow || section.title || section.subtitle ? (
                <div className="section-head reveal">
                  {section.eyebrow ? <span className="eyebrow">{section.eyebrow}</span> : null}
                  {section.title ? <h2 className="section-title">{section.title}</h2> : null}
                  {section.subtitle ? <p className="section-sub">{section.subtitle}</p> : null}
                </div>
              ) : null}

              {section.paragraphs && section.paragraphs.length > 0 ? (
                <div className={section.eyebrow || section.title || section.subtitle ? "grid g-3" : ""} style={{ marginTop: section.eyebrow || section.title || section.subtitle ? "1.6rem" : "0" }}>
                  {section.paragraphs.map((p, pi) => (
                    <p key={pi} className="reveal" style={{ transitionDelay: `${pi * 60}ms` }}>
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}

              {section.checklist && section.checklist.length > 0 ? (
                <ul className="checklist" style={{ marginTop: "1.4rem" }}>
                  {section.checklist.map((item) => (
                    <li key={item}>
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}

        <section className="cta-section">
          <div className="wrap-wide">
            <div className="cta-band reveal">
              <div className="cta-band__inner">
                <div>
                  <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                  <h2>A step towards your future</h2>
                  <p>Applications are open across all three programs. Take the first step today.</p>
                </div>
                <div className="cta-band__actions">
                  <a className="btn btn-gold btn-lg" href="/admission">
                    Apply Now{" "}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                  <a className="btn btn-ghost on-dark btn-lg" href="/about">More Info</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
