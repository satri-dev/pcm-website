"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./programs.css";
import type { Program } from "@/types/programs";
import type { ProgramsPageContent } from "@/types/page-content";

const IMG = "/images";

// Fallback coordinators data (can be moved to CMS later)
const coordinators = [
  {
    photo: `${IMG}/people/leader_hariadhikari.jpg`,
    chip: "HA",
    eyebrow: "BBA Coordinator",
    name: "Hari Adhikari",
    role: "BBA Coordinator",
    text: "Every semester I watch BBA students grow from nervous first-years into confident professionals — and that happens because PCM gives them the platform, the mentors and the opportunities to actually lead. If you are serious about management, this is the place to build the foundation of your career, and I will be here to guide you at every step.",
  },
  {
    photo: `${IMG}/people/leader_hariadhikari.jpg`,
    chip: "HA",
    eyebrow: "BBA-Finance Coordinator",
    name: "Hari Adhikari",
    role: "BBA-Finance Coordinator",
    text: "Finance is the language every business speaks, and at PCM our BBA-Finance programme makes sure you speak it fluently. You will pair a rigorous Pokhara University curriculum with practical exposure to banking, markets and investment — so you graduate ready to make an impact from day one.",
  },
  {
    photo: `${IMG}/people/leader_haribaral.jpg`,
    chip: "EH",
    eyebrow: "BCSIT Coordinator",
    name: "Er. Hari Prasad Baral",
    role: "BCSIT Coordinator",
    text: "Technology changes fast, and our BCSIT programme is designed to keep you ahead of that change. You will learn to think like an engineer — not just code — through hands-on labs, projects and real industry exposure, so you graduate ready to build the digital future.",
  },
];

interface ProgramsClientProps {
  hero?: ProgramsPageContent["hero"];
  intro?: ProgramsPageContent["intro"];
  comparisonTable?: ProgramsPageContent["comparisonTable"];
  cta?: ProgramsPageContent["cta"];
  programs: Program[];
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

// Helper to map program to card format
function mapProgramToCard(program: Program) {
  const slugMap: Record<string, { badge: string; image: string }> = {
    bcsit: { badge: "BCSIT", image: `${IMG}/program-bcsit.jpg` },
    bba: { badge: "BBA", image: `${IMG}/program-bba.jpg` },
    "bba-finance": { badge: "BBA-Finance", image: `${IMG}/program-bbaf.jpg` },
  };
  const mapped = slugMap[program.slug] || { badge: program.code, image: program.image || `${IMG}/program-bba.jpg` };
  
  return {
    badge: mapped.badge,
    image: mapped.image,
    alt: `${program.name} students at PCM`,
    href: `/programs/${program.slug}`,
    title: program.name,
    summary: program.intro || "",
    duration: program.duration,
    credits: "120 Cr", // Could be added to Program type
    seats: program.seats.toString(),
  };
}

// Helper to map program to comparison row
function mapProgramToComparisonRow(program: Program) {
  const focusMap: Record<string, { focus: string; idealFor: string }> = {
    bba: { focus: "General management & leadership", idealFor: "Future managers & entrepreneurs" },
    "bba-finance": { focus: "Finance, investment & banking", idealFor: "Analysts & finance professionals" },
    bcsit: { focus: "IT + business management", idealFor: "Developers, data & IT specialists" },
  };
  const mapped = focusMap[program.slug] || { focus: program.intro || "", idealFor: "" };
  
  return {
    program: program.code,
    focus: mapped.focus,
    duration: program.duration,
    credits: "120", // Could be added to Program type
    idealFor: mapped.idealFor,
  };
}

export default function ProgramsClient({
  hero,
  intro,
  comparisonTable,
  cta,
  programs,
}: ProgramsClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  
  // Fallback values
  const heroData = hero || {
    title: "Academic Programs",
    subtitle: "Three Pokhara University bachelor's degrees, each built to turn four years of study into a career you're proud of.",
  };
  const introData = intro || {
    heading: "Choose your path",
    body: "Every PCM program blends conceptual depth with real-world practice, non-credit skill courses and internship experience.",
  };
  const comparisonData = comparisonTable || {
    heading: "Compare the programs",
    columns: ["Program", "Focus", "Duration", "Credits", "Ideal for"],
  };
  const ctaData = cta || {
    heading: "Ready to choose your program?",
    body: "Apply online in minutes, or reach out and we'll guide you through every step.",
    phone: "(061) 544761",
  };
  
  const cards = programs.map(mapProgramToCard);
  const compareRows = programs.map(mapProgramToComparisonRow);

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
    <div ref={rootRef} className="pcm-programs">
      <section className="page-hero">
          <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#1C4E8A" opacity=".2"/><path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#143560" opacity=".45"/></svg>
          <div className="wrap-wide page-hero__inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>{" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
              <span>Programs</span>
            </nav>
            <h1>{heroData.title}</h1>
            <p>{heroData.subtitle}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <div className="section-head reveal">
              <span className="eyebrow">{introData.heading}</span>
              <h2 className="section-title">Undergraduate degrees at PCM</h2>
              <p className="section-sub">{introData.body}</p>
            </div>
            <div className="grid g-3" style={{ marginTop: "2.5rem" }}>
              {cards.map((card, i) => (
                <article key={card.badge} className="prog-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="prog-card__media">
                    <span className="prog-card__badge">{card.badge}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt={card.alt} loading="lazy" />
                  </div>
                  <div className="prog-card__body">
                    <h3><Link href={card.href}>{card.title}</Link></h3>
                    <p>{card.summary}</p>
                    <div className="prog-meta">
                      <div><b>{card.duration}</b><span>Duration</span></div>
                      <div><b>{card.credits}</b><span>Credit Hours</span></div>
                      <div><b>{card.seats}</b><span>Seats</span></div>
                    </div>
                    <Link className="link-arrow" href={card.href}>Explore {card.badge} <ArrowIcon /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section tone-sky">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">At a glance</span>
              <h2 className="section-title">{comparisonData.heading}</h2>
            </div>
            <div style={{ overflowX: "auto", marginTop: "2rem" }} className="reveal">
              <table className="compare-table ctable" style={{ minWidth: 560 }}>
                <thead>
                  <tr>
                    {comparisonData.columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.program}>
                      <td>{row.program}</td>
                      <td className="td-text">{row.focus}</td>
                      <td>{row.duration}</td>
                      <td>{row.credits}</td>
                      <td className="td-text">{row.idealFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="callout reveal" style={{ marginTop: "1.6rem" }}>
              <h4>Not sure which fits you?</h4>
              <p>Our admissions team helps you match your interests and goals to the right program. Call {ctaData.phone} or visit the campus for a friendly, no-pressure chat.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">Your guides at PCM</span>
              <h2 className="section-title">Meet your program coordinators</h2>
              <p className="section-sub">Each program has a dedicated coordinator who will guide you from your first semester to your final project.</p>
            </div>
            {coordinators.map((person, i) => (
              <article key={person.role} className="leader-card reveal" style={i === 0 ? { marginTop: "2.5rem" } : { marginTop: "1.6rem" }}>
                <div className="leader-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={person.photo} alt={person.name} loading="lazy" />
                  <span className="leader-card__chip">{person.chip}</span>
                </div>
                <div className="leader-card__body">
                  <span className="eyebrow">{person.eyebrow}</span>
                  <h3 className="leader-card__name">{person.name}</h3>
                  <div className="leader-card__role">{person.role}</div>
                  <p className="leader-card__text">{person.text}</p>
                  <Link className="link-arrow" style={{ marginTop: "1.1rem" }} href="/about/message">Read my full message <ArrowIcon /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="wrap-wide">
            <div className="cta-band reveal">
              <div className="cta-band__inner">
                <div>
                  <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                  <h2>{ctaData.heading}</h2>
                  <p>{ctaData.body}</p>
                </div>
                <div className="cta-band__actions">
                  <Link className="btn btn-gold btn-lg" href="/admission">Apply Now <ArrowIcon /></Link>
                  <Link className="btn btn-ghost on-dark btn-lg" href="/about">More Info</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
