"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import FeedbackForm from "@/feature/feedback/components/FeedbackForm";
import "./feedback.css";

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);

export default function FeedbackClient() {
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
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><ChevronRight /><span>Feedback</span>
          </nav>
          <h1>Share Your Feedback</h1>
          <p>Help us improve — your suggestions, comments and appreciations go directly to the team.</p>
        </div>
      </section>

      {/* Form section */}
      <section className="section">
        <div className="wrap-wide">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="eyebrow">Your voice matters</span>
            <h2 className="section-title" style={{ marginTop: ".5rem" }}>Send us a message</h2>
            <p className="section-sub" style={{ marginTop: ".5rem" }}>
              All feedback is reviewed by the PCM management team. You may submit anonymously.
            </p>
          </div>
          <div className="reveal">
            <div className="fb-card">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
