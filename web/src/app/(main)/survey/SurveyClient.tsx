"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSurvey } from "@/feature/survey/hooks/useSurvey";
import SurveyCard from "@/feature/survey/components/SurveyCard";
import QuestionRenderer from "@/feature/survey/components/QuestionRenderer";
import "./survey.css";

/* ── SVG icons ── */
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="36" height="36">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function SurveyClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    surveys, status, activeSurvey, answers, respondent, setRespondent,
    submitting, serverError, openSurvey, backToList, setAnswer, toggleCheckbox, submit,
  } = useSurvey();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("is-inview")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); } }), { threshold: 0.08 });
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [status]);

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
          <h1>Surveys &amp; Polls</h1>
          <p>Participate in our ongoing surveys and help PCM grow and improve.</p>
        </div>
      </section>

      {/* ── Survey list ── */}
      {status === "list" && (
        <section className="section">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">Have your say</span>
              <h2 className="section-title">Active surveys</h2>
              <p className="section-sub">Click any survey to begin. Your responses are anonymous by default.</p>
            </div>

            {surveys.length === 0 ? (
              <div className="sv-empty reveal">
                <ClipboardIcon />
                <h3>No Active Surveys</h3>
                <p>There are no active surveys at the moment. Please check back soon.</p>
              </div>
            ) : (
              <div className="sv-grid">
                {surveys.filter(s => s.isActive).map((survey, i) => (
                  <div key={survey.id} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                    <SurveyCard survey={survey} onOpen={openSurvey} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Survey form ── */}
      {(status === "form" || status === "success") && activeSurvey && (
        <section className="section">
          <div className="wrap-wide sv-form-wrap">
            {/* Back button */}
            {status === "form" && (
              <button type="button" className="sv-back-btn" onClick={backToList}>
                <ChevronLeft /> Back to Surveys
              </button>
            )}

            {/* Success */}
            {status === "success" && (
              <div className="sv-success" role="status" aria-live="polite">
                <div className="sv-success__icon"><CheckIcon /></div>
                <h3>Thank You!</h3>
                <p>Your response has been recorded. We appreciate your participation.</p>
                <button type="button" className="sv-btn sv-btn-outline" onClick={backToList}>
                  ← Back to Surveys
                </button>
              </div>
            )}

            {/* Form */}
            {status === "form" && (
              <>
                <div className="sv-form-header">
                  <h2>{activeSurvey.title}</h2>
                  <p>{activeSurvey.description}</p>
                </div>

                {serverError && (
                  <div className="sv-server-error" role="alert">{serverError}</div>
                )}

                <form onSubmit={submit} noValidate>
                  {/* Respondent name (optional) */}
                  <div className="sv-respondent-field">
                    <label htmlFor="sv-respondent">
                      Your name <span className="sv-hint">(optional — leave blank for anonymous)</span>
                    </label>
                    <input
                      id="sv-respondent"
                      type="text"
                      className="sv-input"
                      placeholder="Enter your name or leave blank"
                      value={respondent}
                      onChange={(e) => setRespondent(e.target.value)}
                      maxLength={80}
                      autoComplete="name"
                    />
                  </div>

                  {/* Questions */}
                  {activeSurvey.questions.map((q, i) => (
                    <QuestionRenderer
                      key={q.id}
                      question={q}
                      index={i}
                      answers={answers}
                      onAnswer={setAnswer}
                      onToggle={toggleCheckbox}
                    />
                  ))}

                  <button
                    type="submit"
                    className="sv-btn sv-btn-primary sv-btn-lg"
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? "Submitting…" : (<>Submit Response <SendIcon /></>)}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
