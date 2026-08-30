"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDownloads } from "@/feature/downloads/hooks/useDownloads";
import { DOWNLOAD_CATEGORIES } from "@/feature/downloads/data/downloads";
import FilterChips from "@/feature/downloads/components/FilterChips";
import DownloadGrid from "@/feature/downloads/components/DownloadGrid";
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

export default function DownloadsClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { filteredItems, activeCategory, setCategory, searchQuery, setSearch } =
    useDownloads();

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
            <span>Downloads</span>
          </nav>
          <h1>Downloads</h1>
          <p>
            Access prospectuses, admission forms, syllabi and scholarship
            application forms — all in one place.
          </p>
        </div>
      </section>

      {/* ── Downloads Section ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Resources</span>
            <h2 className="section-title">Official documents &amp; forms</h2>
            <p className="section-sub">
              Download the files you need. All documents are current for the 2083 intake.
            </p>
          </div>

          {/* Search */}
          <div className="dl-search reveal">
            <span className="dl-search__icon">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search documents…"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search downloadable documents"
            />
          </div>

          {/* Filter chips */}
          <div className="reveal">
            <FilterChips
              categories={DOWNLOAD_CATEGORIES}
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
                  Enter to Learn — Go Forth to Serve
                </span>
                <h2>Ready to apply?</h2>
                <p>
                  Download your admission form above and submit it to the PCM
                  office before Ashar 26, 2083.
                </p>
              </div>
              <div className="cta-band__actions">
                <Link className="btn btn-gold btn-lg" href="/admission">
                  Apply Now <ArrowRight />
                </Link>
                <Link className="btn btn-ghost-dark btn-lg" href="/contact">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
