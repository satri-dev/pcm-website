"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./programs.css";

const IMG = "/images";

const cards = [
  {
    badge: "BCSIT",
    image: `${IMG}/program-bcsit.jpg`,
    alt: "BCSIT students at PCM",
    href: "/programs/bcsit",
    title: "Computer System & Information Technology",
    summary:
      "A four-year, eight-semester degree merging information technology with business management to meet the evolving demands of modern organisations.",
    duration: "4 Years",
    credits: "127 Cr",
    seats: "48",
  },
  {
    badge: "BBA",
    image: `${IMG}/program-bba.jpg`,
    alt: "BBA students at PCM",
    href: "/programs/bba",
    title: "Bachelor in Business Administration",
    summary:
      "Designed to produce professional managers, giving students sound conceptual foundations alongside the practical skills to lead in a dynamic business world.",
    duration: "4 Years",
    credits: "120 Cr",
    seats: "48",
  },
  {
    badge: "BBA-Finance",
    image: `${IMG}/program-bbaf.jpg`,
    alt: "BBA-Finance students at PCM",
    href: "/programs/bba-finance",
    title: "Business Administration in Finance",
    summary:
      "A finance-focused BBA that builds deep expertise in financial analysis, investment and corporate finance for careers in banking and beyond.",
    duration: "4 Years",
    credits: "120 Cr",
    seats: "48",
  },
];

const compareRows = [
  {
    program: "BBA",
    focus: "General management & leadership",
    duration: "4 Years",
    credits: "120",
    idealFor: "Future managers & entrepreneurs",
  },
  {
    program: "BBA-Finance",
    focus: "Finance, investment & banking",
    duration: "4 Years",
    credits: "120",
    idealFor: "Analysts & finance professionals",
  },
  {
    program: "BCSIT",
    focus: "IT + business management",
    duration: "4 Years",
    credits: "127",
    idealFor: "Developers, data & IT specialists",
  },
];

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

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function ProgramsClient() {
  const rootRef = useRef<HTMLDivElement>(null);

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
      <main id="main">
        <section className="page-hero">
          <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#1C4E8A" opacity=".2"/><path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#143560" opacity=".45"/></svg>
          <div className="wrap-wide page-hero__inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>{" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
              <span>Programs</span>
            </nav>
            <h1>Academic Programs</h1>
            <p>Three Pokhara University bachelor&apos;s degrees, each built to turn four years of study into a career you&apos;re proud of.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <div className="section-head reveal">
              <span className="eyebrow">Choose your path</span>
              <h2 className="section-title">Undergraduate degrees at PCM</h2>
              <p className="section-sub">Every PCM program blends conceptual depth with real-world practice, non-credit skill courses and internship experience.</p>
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
              <h2 className="section-title">Compare the programs</h2>
            </div>
            <div style={{ overflowX: "auto", marginTop: "2rem" }} className="reveal">
              <table className="ctable" style={{ minWidth: 640 }}>
                <thead>
                  <tr><th>Program</th><th>Focus</th><th>Duration</th><th>Credits</th><th>Ideal for</th></tr>
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
              <p>Our admissions team helps you match your interests and goals to the right program. Call (061) 544761 or visit the campus for a friendly, no-pressure chat.</p>
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
                  <h2>Ready to choose your program?</h2>
                  <p>Apply online in minutes, or reach out and we&apos;ll guide you through every step.</p>
                </div>
                <div className="cta-band__actions">
                  <Link className="btn btn-gold btn-lg" href="/admission">Apply Now <ArrowIcon /></Link>
                  <Link className="btn btn-ghost on-dark btn-lg" href="/about">More Info</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
