"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import type { PublicFaqItem } from "@/lib/data/faqs";
import type { FaqPageSettings } from "@/lib/data/faq-content";
import FaqList from "@/feature/faq/components/FaqList";
import FaqStillHelp from "@/feature/faq/components/FaqStillHelp";
import "./faq.css";

/* SVG icons */
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

interface FaqClientProps {
  faqs: PublicFaqItem[];
  settings: FaqPageSettings;
}

export default function FaqClient({ faqs, settings }: FaqClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const item of faqs) {
      if (item.category) seen.add(item.category);
    }
    return { items: Array.from(seen), all: seen.size === 0 };
  }, [faqs]);

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

  /* Filtered items */
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    return faqs.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchQ =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [faqs, search, activeCategory]);

  return (
    <div ref={rootRef} className="pcm-faq">
      {/* Page Hero */}
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
            <span>FAQ</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.eyebrow}</span>
            <h2 className="section-title">{settings.title}</h2>
            <p className="section-sub">{settings.subtitle}</p>
          </div>

          {/* Search */}
          <div className="faq-search reveal">
            <span className="faq-search__icon">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder={settings.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search frequently asked questions"
            />
          </div>

          {/* Category filters */}
          <div
            className="faq-filters reveal"
            role="toolbar"
            aria-label="Filter questions by category"
          >
            <button
              key="All"
              className={`faq-filter-btn${activeCategory === "All" ? " active" : ""}`}
              onClick={() => setActiveCategory("All")}
              aria-pressed={activeCategory === "All"}
            >
              All
            </button>
            {categories.items.map((cat) => (
              <button
                key={cat}
                className={`faq-filter-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="reveal">
            <FaqList items={filteredItems} />
            <FaqStillHelp />
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                  {settings.ctaEyebrow}
                </span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <Link className="faq-btn faq-btn-gold faq-btn-lg" href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel} <ArrowRight />
                </Link>
                <Link className="faq-btn faq-btn-ghost-dark faq-btn-lg" href={settings.ctaSecondaryHref}>
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
