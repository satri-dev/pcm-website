"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import FeedbackForm from "@/feature/feedback/components/FeedbackForm";
import type { FeedbackPageSettings } from "@/types/feedback-page-settings";
import "./feedback.css";

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);

export default function FeedbackClient({
  settings,
}: {
  settings: FeedbackPageSettings;
}) {
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
    <div ref={rootRef} className="pcm-feedback">
      {/* Page hero */}
      <section
        className="page-hero"
        style={
          settings.heroImage
            ? {
                backgroundImage: `linear-gradient(rgba(22, 40, 91, 0.82), rgba(13, 27, 63, 0.9)), url(${settings.heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><ChevronRight /><span>{settings.breadcrumbLabel}</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      {/* Form section */}
      <section className="section">
        <div className="wrap-wide">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="eyebrow">{settings.formEyebrow}</span>
            <h2 className="section-title" style={{ marginTop: ".5rem" }}>{settings.formTitle}</h2>
            <p className="section-sub" style={{ marginTop: ".5rem" }}>
              {settings.formSubtitle}
            </p>
          </div>
          <div className="reveal">
            <div className="fb-card">
              <FeedbackForm settings={settings} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
