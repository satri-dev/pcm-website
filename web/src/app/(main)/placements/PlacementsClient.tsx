"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { PlacementsPageSettings } from "@/types/placements-page-settings";
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

interface Props {
  settings: PlacementsPageSettings;
}

export default function PlacementsClient({ settings }: Props) {
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
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroSubtitle}</p>
          </div>
        </section>

        {/* ── From classroom to career ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="split reveal">
              {/* Left content */}
              <div className="split__content">
                <span className="eyebrow">{settings.classEyebrow}</span>
                <h2 className="section-title">{settings.classTitle}</h2>
                {settings.classParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <div className="pill-row">
                  {settings.classPills.map((pill, i) => (
                    <span key={i} className="pill">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right media */}
              <div className="split__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.classImageSrc}
                  alt={settings.classImageAlt}
                  width={800}
                  height={600}
                />
                <div className="est-badge">
                  <span className="est-badge__value">
                    {settings.badgeValue}
                  </span>
                  <span className="est-badge__label">
                    {settings.badgeLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Recruitment partners ── */}
        <section className="section tone-sky">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">{settings.partnersEyebrow}</span>
              <h2 className="section-title">{settings.partnersTitle}</h2>
              <p className="section-sub">{settings.partnersSubtitle}</p>
            </div>
            <PartnerGrid partners={settings.partners} />
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
                  src={settings.guidanceImageSrc}
                  alt={settings.guidanceImageAlt}
                  width={800}
                  height={600}
                />
              </div>

              {/* Right content */}
              <div className="split__content">
                <span className="eyebrow">{settings.guidanceEyebrow}</span>
                <h2 className="section-title">{settings.guidanceTitle}</h2>
                <p>{settings.guidanceParagraph}</p>
                <CareerServicesList services={settings.services} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar (full-width, no section wrapper) ── */}
        <StatsBar stats={settings.stats} />

        {/* ── CTA band ── */}
        <section className="cta-section">
          <div className="wrap-wide">
            <div className="cta-band reveal">
              <div className="cta-band__inner">
                <div>
                  <span
                    className="eyebrow"
                    style={{ color: "var(--gold-400)" }}
                  >
                    {settings.ctaEyebrow}
                  </span>
                  <h2>{settings.ctaTitle}</h2>
                  <p>{settings.ctaText}</p>
                </div>
                <div className="cta-band__actions">
                  <Link
                    className="pl-btn pl-btn-gold pl-btn-lg"
                    href={settings.ctaPrimaryHref}
                  >
                    {settings.ctaPrimaryLabel} <ArrowRight />
                  </Link>
                  <Link
                    className="pl-btn pl-btn-ghost-dark pl-btn-lg"
                    href={settings.ctaSecondaryHref}
                  >
                    {settings.ctaSecondaryLabel}
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
