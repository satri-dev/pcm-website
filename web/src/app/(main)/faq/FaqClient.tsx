"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { faqItems, FAQ_CATEGORIES, type FaqCategory } from "@/feature/faq/data/faq";
import FaqList from "@/feature/faq/components/FaqList";
import FaqStillHelp from "@/feature/faq/components/FaqStillHelp";
import "./faq.css";

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

export default function FaqClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("All");

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
    return faqItems.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchQ =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, activeCategory]);

  return (
    <div ref={rootRef} className="pcm-faq">
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
            <span>FAQ</span>
          </nav>
          <h1>Frequently Asked Questions</h1>
          <p>
            Quick answers to the questions we hear most — about programmes,
            admissions, scholarships, campus life and more.
          </p>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Got questions?</span>
            <h2 className="section-title">We have answers</h2>
            <p className="section-sub">
              Use the search or filter by topic to find what you need.
            </p>
          </div>

          {/* Search */}
          <div className="faq-search reveal">
            <span className="faq-search__icon">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search questions…"
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
            {FAQ_CATEGORIES.map((cat) => (
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

      {/* ── CTA band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                  Enter to Learn — Go Forth to Serve
                </span>
                <h2>Ready to join PCM?</h2>
                <p>
                  Applications for the 2083 intake are open. Take the first step
                  towards your future today.
                </p>
              </div>
              <div className="cta-band__actions">
                <Link className="faq-btn faq-btn-gold faq-btn-lg" href="/admission">
                  Apply Now <ArrowRight />
                </Link>
                <Link className="faq-btn faq-btn-ghost-dark faq-btn-lg" href="/contact">
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
