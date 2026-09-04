"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Survey } from "@/types/surveys";
import type { SurveyPageData } from "./SurveyServer";
import "./survey.css";

/* ── SVG icons ── */
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);

function fmtDeadline(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const NUMBERED_TYPES = new Set<Survey["questions"][number]["type"]>([
  "text", "textarea", "number", "email", "phone", "url",
  "radio", "checkbox", "select", "rating", "date", "time",
]);

function countQuestions(questions: Survey["questions"]): number {
  if (!questions) return 0;
  return questions.reduce(
    (acc, q) =>
      acc +
      (NUMBERED_TYPES.has(q.type) ? 1 : 0) +
      countQuestions(q.children ?? []),
    0
  );
}

function SurveyCard({ survey }: { survey: Survey }) {
  const deadline = fmtDeadline(survey.endsOn);
  const n = countQuestions(survey.questions);
  return (
    <Link href={`/survey/${survey.slug}`} className="sv-card">
      <div className="sv-card__header">
        <span className="sv-card__icon" aria-hidden="true">{survey.icon || "📋"}</span>
        <span className="sv-card__cat">{survey.category}</span>
      </div>
      <h3 className="sv-card__title">{survey.title}</h3>
      <div
        className="prose prose-sm max-w-none sv-card__desc"
        dangerouslySetInnerHTML={{ __html: survey.excerpt || survey.content }}
      />
      <div className="sv-card__meta">
        <span className="sv-card__meta-item"><ClockIcon /> ~{survey.timeToRead || 1} min</span>
        <span className="sv-card__meta-item">{n} questions</span>
        {deadline && <span className="sv-card__meta-item sv-card__deadline">Ends {deadline}</span>}
      </div>
      <div className="sv-card__foot">
        <span className="sv-card__cta">Take survey <ArrowIcon /></span>
      </div>
    </Link>
  );
}

export default function SurveyClient({ data }: { data: SurveyPageData }) {
  const { settings, surveys, page, pages, perPage } = data;
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
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-inview");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  const prevHref = page > 1 ? `/survey?page=${page - 1}` : null;
  const nextHref = page < pages ? `/survey?page=${page + 1}` : null;

  return (
    <div ref={rootRef} className="pcm-survey">
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><ChevronRight /><span>Surveys</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      {/* ── Survey list ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">{settings.listEyebrow}</span>
            <h2 className="section-title">{settings.listTitle}</h2>
            <p className="section-sub">{settings.listSubtitle}</p>
          </div>

          {surveys.length === 0 ? (
            <div className="sv-empty reveal">
              <ClipboardIcon />
              <h3>{settings.emptyTitle}</h3>
              <p>{settings.emptyText}</p>
            </div>
          ) : (
            <>
              <div className="sv-grid">
                {surveys.map((survey, i) => (
                  <div key={survey.slug} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                    <SurveyCard survey={survey} />
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  <span className="pagination__info">
                    Page {page} of {pages} · {perPage} per page
                  </span>
                  <span className="pagination__list">
                    {prevHref ? (
                      <Link className="pagination__btn" href={prevHref} aria-label="Previous page">
                        <ChevronLeft /><span className="pagination__label">Prev</span>
                      </Link>
                    ) : (
                      <button type="button" className="pagination__btn" aria-disabled={true} disabled aria-label="Previous page">
                        <ChevronLeft /><span className="pagination__label">Prev</span>
                      </button>
                    )}
                    {pageNumbers.map((n) => (
                      <Link
                        key={n}
                        href={n === 1 ? "/survey" : `/survey?page=${n}`}
                        className={`pagination__num${n === page ? " is-current" : ""}`}
                        aria-current={n === page ? "page" : undefined}
                      >
                        {n}
                      </Link>
                    ))}
                    {nextHref ? (
                      <Link className="pagination__btn" href={nextHref} aria-label="Next page">
                        <span className="pagination__label">Next</span><ChevronRight />
                      </Link>
                    ) : (
                      <button type="button" className="pagination__btn" aria-disabled={true} disabled aria-label="Next page">
                        <span className="pagination__label">Next</span><ChevronRight />
                      </button>
                    )}
                  </span>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="section"><div className="wrap-wide">
        <div className="cta-band reveal">
          <div className="cta-band__inner">
            <div>
              <span className="eyebrow on-dark">{settings.ctaEyebrow}</span>
              <h2>{settings.ctaTitle}</h2>
              <p>{settings.ctaText}</p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-gold btn-lg" href={settings.ctaHref}>{settings.ctaLabel} <ChevronRight /></Link>
            </div>
          </div>
        </div>
      </div></section>
    </div>
  );
}
