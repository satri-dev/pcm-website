"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ScholarshipPageSettings } from "@/types/scholarship-page-settings";
import type { Scholarship } from "@/types/scholarships";
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
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function ScholarshipCard({ item }: { item: Scholarship }) {
  return (
    <article className="scholarship-card">
      <span className="scholarship-card__tag">{item.type}</span>
      <h3>{item.title}</h3>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: item.desc }}
      />
    </article>
  );
}

export default function ScholarshipClient({
  settings,
  scholarships,
}: {
  settings: ScholarshipPageSettings;
  scholarships: Scholarship[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

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
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      {/* ── Ways we support you ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">{settings.supportEyebrow}</span>
            <h2 className="section-title">{settings.supportTitle}</h2>
            <p className="section-sub">{settings.supportSubtitle}</p>
          </div>

          {scholarships.length > 0 ? (
            <div className="scholarship-grid">
              {scholarships.map((item) => (
                <div key={item.id} className="reveal">
                  <ScholarshipCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <p className="section-sub" style={{ textAlign: "center" }}>
              Scholarship details will be published here soon.
            </p>
          )}
        </div>
      </section>

      {/* ── How to apply ── */}
      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.applyEyebrow}</span>
            <h2 className="section-title">{settings.applyTitle}</h2>
            <p className="section-sub">{settings.applySubtitle}</p>
          </div>

          <div className="how-to-apply reveal">
            <div className="how-to-apply__content">
              <ol className="checklist" aria-label="How to apply for a scholarship">
                {settings.applySteps.map((step, i) => (
                  <li key={step.id} className="checklist__item">
                    <span className="checklist__num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="checklist__icon" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span className="checklist__text">{step.text}</span>
                  </li>
                ))}
              </ol>
              <div className="how-to-apply__cta">
                <Link href={settings.applyCtaHref} className="sc-btn sc-btn-primary sc-btn-lg">
                  {settings.applyCtaLabel} <ArrowRight />
                </Link>
              </div>
            </div>
            <div className="how-to-apply__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.applyImageSrc}
                alt={settings.applyImageAlt}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Scholarship FAQs ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">{settings.faqEyebrow}</span>
            <h2 className="section-title">{settings.faqTitle}</h2>
            <p className="section-sub">{settings.faqSubtitle}</p>
          </div>

          <div className="sc-faqs reveal">
            {settings.faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`faq-callout${isOpen ? " faq-callout--open" : ""}`}
                >
                  <button
                    className="faq-callout__header"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`sfaq-body-${faq.id}`}
                    id={`sfaq-btn-${faq.id}`}
                  >
                    <span className="faq-callout__q">{faq.question}</span>
                    <span className="faq-callout__chevron" aria-hidden="true">
                      <ChevronDown />
                    </span>
                  </button>
                  <div
                    className="faq-callout__body"
                    id={`sfaq-body-${faq.id}`}
                    role="region"
                    aria-labelledby={`sfaq-btn-${faq.id}`}
                    hidden={!isOpen}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
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
                  {settings.ctaEyebrow}
                </span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <Link className="sc-btn sc-btn-gold sc-btn-lg" href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel} <ArrowRight />
                </Link>
                <Link className="sc-btn sc-btn-ghost-dark sc-btn-lg" href={settings.ctaSecondaryHref}>
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
