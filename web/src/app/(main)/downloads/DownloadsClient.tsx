"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDownloads } from "@/feature/downloads/hooks/useDownloads";
import { deriveCategories } from "@/feature/downloads/data/downloads";
import FilterChips from "@/feature/downloads/components/FilterChips";
import DownloadGrid from "@/feature/downloads/components/DownloadGrid";
import type { DownloadItem } from "@/feature/downloads/types";
import type { DownloadsPageSettings } from "@/types/downloads-page-settings";
import { DOWNLOADS_PAGE_SETTINGS_DEFAULTS } from "@/types/downloads-page-settings";
import "./downloads.css";

/* ── SVG icons ── */
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

interface Props {
  items: DownloadItem[];
  settings: DownloadsPageSettings;
}

export default function DownloadsClient({ items, settings }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const s = {
    ...DOWNLOADS_PAGE_SETTINGS_DEFAULTS,
    ...settings,
  };

  const categories = deriveCategories(items.map((i) => i.category));
  const { filteredItems, activeCategory, setCategory, searchQuery, setSearch } =
    useDownloads({ items, categories });

  /* Reveal-on-scroll */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-inview"));
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filteredItems]);

  return (
    <div ref={rootRef} className="pcm-downloads">
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
            <span>{s.heroTitle}</span>
          </nav>
          <h1>{s.heroTitle}</h1>
          <p>{s.heroSubtitle}</p>
        </div>
      </section>

      {/* ── Downloads Section ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{s.eyebrow}</span>
            <h2 className="section-title">{s.title}</h2>
            {s.subtitle ? (
              <p className="section-sub">{s.subtitle}</p>
            ) : null}
          </div>

          {/* Search */}
          <div className="dl-search reveal">
            <span className="dl-search__icon">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder={s.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search downloadable documents"
            />
          </div>

          {/* Filter chips */}
          <div className="reveal">
            <FilterChips
              categories={categories}
              active={activeCategory}
              onChange={setCategory}
            />
          </div>

          {/* Download grid */}
          <DownloadGrid items={filteredItems} />
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                  {s.ctaEyebrow}
                </span>
                <h2>{s.ctaTitle}</h2>
                <p>{s.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <Link className="btn btn-gold btn-lg" href={s.ctaPrimaryHref}>
                  {s.ctaPrimaryLabel} <ArrowRight />
                </Link>
                <Link className="btn btn-ghost-dark btn-lg" href={s.ctaSecondaryHref}>
                  {s.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
