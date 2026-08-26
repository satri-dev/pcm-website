"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useGpaCalculator } from "@/feature/gpa-converter/hooks/useGpaCalculator";
import SubjectTable from "@/feature/gpa-converter/components/SubjectTable";
import GpaResult from "@/feature/gpa-converter/components/GpaResult";
import GradingScaleTable from "@/feature/gpa-converter/components/GradingScaleTable";
import type { Subject } from "@/feature/gpa-converter/types";
import "./gpa.css";

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function GpaClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { subjects, updateSubject, addSubject, removeSubject, clearAll, calculate, result, calculated } = useGpaCalculator();

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
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pcm-gpa">

      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            <span>GPA Converter</span>
          </nav>
          <h1>GPA Calculator</h1>
          <p>Enter your marks for each subject and instantly calculate your SGPA using the Pokhara University grading scale.</p>
        </div>
      </section>

      {/* ── Calculator + Result ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="gpa-layout">

            {/* Left — subject table */}
            <div className="gpa-calc-card reveal">
              <div style={{ marginBottom: "1.4rem" }}>
                <span className="eyebrow">GPA Calculator</span>
                <h2 className="section-title" style={{ marginTop: ".4rem" }}>
                  Enter your subject marks
                </h2>
                <p className="section-sub" style={{ marginTop: ".5rem" }}>
                  Add as many subjects as you need. Subjects cannot be removed individually
                  — use <strong>Clear All</strong> to start over.
                </p>
              </div>
              <SubjectTable
                subjects={subjects}
                results={result.subjects}
                onAddSubject={addSubject}
                onRemoveSubject={removeSubject}
                onClearAll={clearAll}
                onCalculate={calculate}
                onUpdateSubject={(id: string, field: keyof Subject, value: string) => updateSubject(id, field, value)}
              />
            </div>

            {/* Right — result (only shows after Calculate is clicked) */}
            <GpaResult result={result} calculated={calculated} />
          </div>
        </div>
      </section>

      {/* ── Grading scale reference ── */}
      <section className="section tone-sky">
        <div className="wrap-wide">
          <div style={{ maxWidth: 640, marginBottom: "2rem" }} className="reveal">
            <span className="eyebrow">Reference</span>
            <h2 className="section-title" style={{ marginTop: ".4rem" }}>Pokhara University Grading Scale</h2>
            <p className="section-sub" style={{ marginTop: ".5rem" }}>
              All PCM programs — BBA, BBA-Finance and BCSIT — follow this scale as per PU academic regulations.
            </p>
          </div>
          <div className="reveal">
            <GradingScaleTable />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="wrap-wide split">
          <div className="reveal">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title" style={{ marginTop: ".4rem" }}>Understanding your SGPA</h2>
            <p style={{ marginTop: "1rem", color: "var(--body-c)" }}>
              Your <strong>SGPA</strong> (Semester Grade Point Average) is calculated as:
            </p>
            <div style={{
              margin: "1rem 0", padding: "1rem 1.25rem",
              background: "var(--surface-tint)", borderRadius: "var(--r)",
              borderLeft: "4px solid var(--brand-600)",
              fontFamily: "var(--ff-mono)", fontSize: ".9rem", color: "var(--navy)",
            }}>
              SGPA = Σ (Credit Hours × Grade Point) ÷ Σ Credit Hours
            </div>
            <p style={{ color: "var(--body-c)" }}>
              For each subject: obtained marks ÷ total full marks × 100 gives your percentage, which maps to a letter grade and grade point. Credit-weighted averages then combine into your SGPA.
            </p>
            <ul className="checklist" style={{ marginTop: "1.2rem" }}>
              {[
                "Theory Full Marks = marks the theory exam is out of (e.g. 60, 80, 100)",
                "Practical Full Marks = internal/lab marks (enter 0 if no practical)",
                "Theory Obtained = your actual marks in the theory exam",
                "Practical Obtained = your actual marks in practical (disabled if Practical Full = 0)",
                "Percentage = (Theory + Practical obtained) ÷ (Theory + Practical full) × 100",
                "Grades run from A (4.0) to F (0.0) on the PU 4-point scale",
                "A subject with grade D or below should be retaken",
              ].map((item) => (
                <li key={item}><CheckIcon />{item}</li>
              ))}
            </ul>
          </div>
          <div className="split__media reveal">
            <div className="split__media-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/hero-6.jpg" alt="PCM students in class" loading="lazy" />
            </div>
            <div className="est-badge">
              <b>4.0</b>
              <span>Max GPA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                  Enter to Learn — Go Forth to Serve
                </span>
                <h2>A step towards your future</h2>
                <p>Applications for the 2083 intake are open across BBA, BBA-Finance and BCSIT.</p>
              </div>
              <div className="cta-band__actions">
                <Link className="gpa-btn gpa-btn-gold gpa-btn-lg" href="/admission">
                  Apply Now <ArrowRight />
                </Link>
                <Link className="gpa-btn gpa-btn-ghost-dark gpa-btn-lg" href="/programs">
                  Explore Programs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
