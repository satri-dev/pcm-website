"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  recruitmentPartners,
  careerServices,
  placementStats,
} from "@/feature/placements/data/placements";
import PartnerGrid from "@/feature/placements/components/PartnerGrid";
import CareerServicesList from "@/feature/placements/components/CareerServicesList";
import StatsBar from "@/feature/placements/components/StatsBar";
import "./placements.css";

/* ── SVG icons ── */
const ChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function PlacementsClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Reveal-on-scroll */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-inview");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={rootRef} className="pcm-placements">
        {/* ── Page Hero ── */}
        <section className="page-hero">
          <svg
            className="page-hero__peaks"
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z"
              fill="#4167C9"
              opacity=".2"
            />
            <path
              d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z"
              fill="#14265A"
              opacity=".45"
            />
          </svg>
          <div className="wrap-wide page-hero__inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight />
              <span>Placements &amp; Careers</span>
            </nav>
            <h1>Placements &amp; Careers</h1>
            <p>
              PCM prepares graduates not just for exams but for careers — with
              strong recruiter partnerships, career guidance and a 90%
              placement rate across BBA, BBA-Finance and BCSIT programmes.
            </p>
          </div>
        </section>

        {/* ── From classroom to career ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="split reveal">
              {/* Left content */}
              <div className="split__content">
                <span className="eyebrow">Career outcomes</span>
                <h2 className="section-title">From classroom to career</h2>
                <p>
                  Our academic programmes are designed in close consultation
                  with industry partners, ensuring graduates are equipped with
                  practical skills and professional readiness from day one.
                </p>
                <p>
                  Through campus recruitment drives, internship placements and
                  career mentorship, PCM graduates consistently secure roles
                  at Nepal&apos;s leading organisations shortly after
                  completing their studies.
                </p>
                <div className="pill-row">
                  <span className="pill">90% Placement Rate</span>
                  <span className="pill">Campus Drives</span>
                  <span className="pill">Internships</span>
                  <span className="pill">Career Guidance</span>
                </div>
              </div>

              {/* Right media */}
              <div className="split__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/about-graduation.jpg"
                  alt="PCM graduation ceremony"
                  width={800}
                  height={600}
                />
                <div className="est-badge">
                  <span className="est-badge__value">90%</span>
                  <span className="est-badge__label">Placement Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Recruitment partners ── */}
        <section className="section tone-sky">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">Industry connect</span>
              <h2 className="section-title">Recruitment partners</h2>
              <p className="section-sub">
                Our graduates are recruited by leading organisations across
                three major sectors in Nepal.
              </p>
            </div>
            <PartnerGrid partners={recruitmentPartners} />
          </div>
        </section>

        {/* ── Career guidance ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="split reverse reveal">
              {/* Left media */}
              <div className="split__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/about-2.jpg"
                  alt="Career guidance session at PCM"
                  width={800}
                  height={600}
                />
              </div>

              {/* Right content */}
              <div className="split__content">
                <span className="eyebrow">Student support</span>
                <h2 className="section-title">Career guidance at every step</h2>
                <p>
                  Our dedicated placement cell works year-round to prepare
                  students for the job market — from the first semester to
                  final placement.
                </p>
                <CareerServicesList services={careerServices} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar (full-width, no section wrapper) ── */}
        <StatsBar stats={placementStats} />

        {/* ── CTA band ── */}
        <section className="cta-section">
          <div className="wrap-wide">
            <div className="cta-band reveal">
              <div className="cta-band__inner">
                <div>
                  <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                    Enter to Learn — Go Forth to Serve
                  </span>
                  <h2>Your career starts at PCM</h2>
                  <p>
                    Join thousands of PCM alumni thriving across Nepal&apos;s
                    banks, tech companies and enterprises. Applications for
                    2083 are open.
                  </p>
                </div>
                <div className="cta-band__actions">
                  <Link className="pl-btn pl-btn-gold pl-btn-lg" href="/admission">
                    Apply Now <ArrowRight />
                  </Link>
                  <Link className="pl-btn pl-btn-ghost-dark pl-btn-lg" href="/programs">
                    Explore Programs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
