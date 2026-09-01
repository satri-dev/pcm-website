"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CareersPageSettings } from "@/types/careers-page-settings";
import JobCard from "@/feature/careers/components/JobCard";
import BenefitCard from "@/feature/careers/components/BenefitCard";
import "./careers.css";

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function CareersClient({ settings }: { settings: CareersPageSettings }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("is-inview")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); } }), { threshold: 0.1 });
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pcm-careers">

      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight />
            <span>Careers</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      {/* ── Current openings ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.openingsEyebrow}</span>
            <h2 className="section-title">{settings.openingsTitle}</h2>
            <p className="section-sub">{settings.openingsSubtitle}</p>
          </div>
          <div className="career-jobs-grid">
            {settings.openings.map((job, i) => (
              <div key={job.id} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <JobCard item={job} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to apply ── */}
      <section className="section tone-sky">
        <div className="wrap-wide split">
          <div className="split__content reveal">
            <span className="eyebrow">{settings.applyEyebrow}</span>
            <h2 className="section-title">{settings.applyTitle}</h2>
            <p>{settings.applyParagraph}</p>
            <ul className="checklist">
              {settings.applySteps.map(step => (
                <li key={step.id}><CheckIcon />{step.text}</li>
              ))}
            </ul>
            <div className="pill-row">
              {settings.applyPills.map(pill => (
                <span key={pill} className="pill">{pill}</span>
              ))}
            </div>
          </div>
          <div className="split__media reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.applyImageSrc} alt={settings.applyImageAlt} loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── Why work at PCM ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">{settings.benefitsEyebrow}</span>
            <h2 className="section-title">{settings.benefitsTitle}</h2>
            <p className="section-sub">{settings.benefitsSubtitle}</p>
          </div>
          <div className="career-benefits-grid">
            {settings.benefits.map((benefit, i) => (
              <div key={benefit.id} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <BenefitCard item={benefit} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>{settings.ctaEyebrow}</span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <a
                  className="career-btn career-btn-gold career-btn-lg"
                  href={`mailto:${settings.ctaEmailAddress}?subject=${encodeURIComponent(settings.ctaEmailSubject)}`}
                >
                  {settings.ctaPrimaryLabel} <ArrowRight />
                </a>
                <Link className="career-btn career-btn-ghost-dark career-btn-lg" href={settings.ctaSecondaryHref}>
                  {settings.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
