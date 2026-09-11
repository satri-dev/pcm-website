"use client";

import Link from "next/link";
import type { LegalPageSettings } from "@/types/legal-page-settings";
import "./legal.css";

export default function LegalPageRenderer({ page }: { page: LegalPageSettings }) {
  return (
    <div className="pcm-legal">
      {/* Hero */}
      <section className="page-hero">
        <svg
          className="page-hero__peaks"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span aria-current="page">{page.heroTitle}</span>
          </nav>
          <h1>{page.heroTitle}</h1>
          <p>{page.heroSubtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="wrap-wide" style={{ maxWidth: 820 }}>
          <div className="prose">
            <p><strong>Last updated:</strong> {page.lastUpdated}</p>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow">{page.ctaEyebrow}</span>
                <h2>{page.ctaTitle}</h2>
                <p>{page.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <Link
                  href={page.ctaPrimaryHref}
                  className="btn btn-gold btn-lg"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: ".5rem",
                    padding: ".75rem 1.75rem", borderRadius: "999px",
                    background: "#51B747", color: "#fff", fontWeight: 600,
                    fontSize: ".95rem", textDecoration: "none",
                  }}
                >
                  {page.ctaPrimaryLabel}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link
                  href={page.ctaSecondaryHref}
                  className="btn btn-ghost on-dark btn-lg"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: ".5rem",
                    padding: ".75rem 1.75rem", borderRadius: "999px",
                    border: "1.5px solid rgba(255,255,255,.4)", color: "#fff",
                    fontWeight: 600, fontSize: ".95rem", textDecoration: "none",
                  }}
                >
                  {page.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
