"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "../about/legacy/legacy.css";
import "./alumni.css";

const IMG = "/images";

const alumni = [
  {
    photo: "/images/people/leader_binod.jpg",
    name: "Binod Adhikari",
    program: "BBA • 2013",
    role: "Branch Manager, Nabil Bank",
  },
  {
    photo: "/images/people/leader_leena.jpg",
    name: "Leena Shrestha",
    program: "BBA • 2014",
    role: "Marketing Manager, F1Soft",
  },
  {
    photo: "/images/people/leader_haribaral.jpg",
    name: "Hari Baral",
    program: "BCSIT • 2016",
    role: "Software Engineer, Leapfrog",
  },
  {
    photo: "/images/people/leader_tanka.jpg",
    name: "Tanka Koirala",
    program: "BBA-Finance • 2015",
    role: "Credit Analyst, NIC Asia Bank",
  },
  {
    photo: "/images/people/staff_sabita.jpg",
    name: "Sabita Gurung",
    program: "BBA • 2017",
    role: "Founder, Karma Cafe",
  },
  {
    photo: "/images/people/staff_shusan.jpg",
    name: "Shusan Lamichhane",
    program: "BCSIT • 2018",
    role: "Product Manager, CloudFactory",
  },
  {
    photo: "/images/people/staff_surendra.jpg",
    name: "Surendra Pun",
    program: "BBA-Finance • 2019",
    role: "Investment Analyst, Mega Bank",
  },
  {
    photo: "/images/people/fac_saroj.jpg",
    name: "Saroj Kuwar",
    program: "BBA • 2014",
    role: "Lecturer & Researcher",
  },
];

const whyItems = [
  "Run real events — fests, seminars and competitions",
  "Build a portfolio of leadership and teamwork",
  "Connect with mentors, alumni and industry partners",
];

const careerPaths = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Z" />
        <path d="M5 13v6c0 1.5 3 2.5 7 2.5s7-1 7-2.5v-6" />
      </svg>
    ),
    bg: "#eef3ff",
    color: "#21409A",
    title: "Banking & Finance",
    description:
      "Graduates work at Nabil, Himalayan, NIC Asia, Mega and other leading banks and financial institutions.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    bg: "#eaf9ee",
    color: "#3F9E35",
    title: "Technology & Software",
    description:
      "BCSIT alumni build software and systems at Nepali startups, IT firms and global product companies.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
      </svg>
    ),
    bg: "#fff7e8",
    color: "#b98a12",
    title: "Entrepreneurship",
    description:
      "From cafés to fintech, many PCM graduates launch their own ventures — supported by our culture of enterprise.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4Z" />
        <path d="m2 8 8 6 4-3 8 5" />
      </svg>
    ),
    bg: "#eef3ff",
    color: "#21409A",
    title: "Education & Research",
    description:
      "Many alumni pursue master's degrees at home and abroad, and give back as educators and mentors.",
  },
];

export default function AlumniClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = rootRef.current?.querySelectorAll(".reveal");
    if (!items?.length) return;

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
    <div ref={rootRef} className="pcm-alumni">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>{" "}
            <span>Alumni Network</span>
          </nav>
          <h1>Alumni Network</h1>
          <p>Meet the graduates of Pokhara College of Management — 1000+ professionals in banking, technology, entrepreneurship and more.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide split">
          <div className="reveal">
            <span className="eyebrow">Our alumni family</span>
            <h2 className="section-title">A network that stays connected</h2>
            <p style={{ marginTop: "1rem" }}>
              Since 2002, PCM has produced 1000+ graduates who now lead teams, build companies and shape industries across Nepal and beyond. Our alumni network keeps that community connected through events, mentorship and opportunities.
            </p>
            <p>
              Whatever your year or program, the doors of PCM never close — alumni regularly return to guest-lecture, mentor current students and support placement drives.
            </p>
            <div className="pill-row" style={{ marginTop: "1.4rem" }}>
              <span className="pill">1000+ Graduates</span>
              <span className="pill">Banking & Finance</span>
              <span className="pill">Technology</span>
              <span className="pill">Entrepreneurship</span>
            </div>
          </div>
          <div className="split__media reveal">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <Image
                className="split-media-img"
                src={`${IMG}/about-graduation.jpg`}
                alt="PCM graduates in caps and gowns"
                width={800}
                height={600}
                loading="lazy"
              />
            </div>
            <div className="est-badge">
              <b>1000+</b>
              <span>Graduates</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Alumni spotlight</span>
            <h2 className="section-title">Meet our graduates</h2>
            <p className="section-sub">
              A few of the 1000+ PCM alumni making an impact in banking, technology, education and entrepreneurship.
            </p>
          </div>
          <div className="grid g-4" style={{ marginTop: "2rem" }}>
            {alumni.map((person, i) => (
              <article key={person.name} className="alumni-card reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <div className="alumni-card__photo">
                  <Image 
                    src={person.photo} 
                    alt={person.name} 
                    fill
                    sizes="200px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3>{person.name}</h3>
                <small className="alumni-card__prog">{person.program}</small>
                <span className="alumni-card__role">{person.role}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Where they go</span>
            <h2 className="section-title">Alumni in the world</h2>
          </div>
          <div className="grid g-4">
            {careerPaths.map((path, i) => (
              <div key={path.title} className="card icon-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="icon-card__icon" style={{ background: path.bg, color: path.color }}>
                  {path.icon}
                </div>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>A step towards your future</h2>
                <p>Applications for the 2083 intake are open across all three programs. Take the first step today.</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg " href="/admission">
                  Apply Now{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a className="btn btn-ghost on-dark btn-lg" href="/programs">
                  Explore Programs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
