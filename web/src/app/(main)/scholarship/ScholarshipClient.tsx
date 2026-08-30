"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  scholarshipTypes,
  applicationSteps,
  scholarshipFaqs,
} from "@/feature/scholarship/data/scholarship";
import ScholarshipCard from "@/feature/scholarship/components/ScholarshipCard";
import HowToApply from "@/feature/scholarship/components/HowToApply";
import ScholarshipFaqs from "@/feature/scholarship/components/ScholarshipFaqs";
import "./scholarship.css";

/* ── SVG icons ── */
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function ScholarshipClient() {
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
    <div ref={rootRef} className="pcm-scholarship">
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg
          className="page-hero__peaks"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight />
            <span>Scholarships</span>
          </nav>
          <h1>Scholarships at PCM</h1>
          <p>
            We believe financial barriers should never stand in the way of a
            quality education. Explore how PCM supports deserving students.
          </p>
        </div>
      </section>

      {/* ── Ways we support you ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">Support programmes</span>
            <h2 className="section-title">Ways we support you</h2>
            <p className="section-sub">
              Four distinct pathways to make your studies at PCM more affordable.
            </p>
          </div>

          <div className="scholarship-grid">
            {scholarshipTypes.map((item) => (
              <div key={item.id} className="reveal">
                <ScholarshipCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to apply ── */}
      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Simple process</span>
            <h2 className="section-title">How to apply</h2>
            <p className="section-sub">
              Scholarship consideration is built into the admission process —
              no separate application needed in most cases.
            </p>
          </div>

          <div className="reveal">
            <HowToApply steps={applicationSteps} />
          </div>
        </div>
      </section>

      {/* ── Scholarship FAQs ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">Common questions</span>
            <h2 className="section-title">Scholarship FAQs</h2>
            <p className="section-sub">
              A few quick answers to what students ask most.
            </p>
          </div>

          <div className="reveal">
            <ScholarshipFaqs faqs={scholarshipFaqs} />
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                  Enter to Learn — Go Forth to Serve
                </span>
                <h2>Talk to us about scholarships</h2>
                <p>
                  Our admissions team is happy to walk you through every option
                  and help you find the support that fits.
                </p>
              </div>
              <div className="cta-band__actions">
                <Link className="sc-btn sc-btn-gold sc-btn-lg" href="/admission">
                  Apply Now <ArrowRight />
                </Link>
                <Link className="sc-btn sc-btn-ghost-dark sc-btn-lg" href="/contact">
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
