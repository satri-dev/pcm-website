"use client";

import StarRating from "./StarRating";
import { useFeedbackForm } from "../hooks/useFeedbackForm";
import type { FeedbackCategory } from "../types";

const CATEGORIES: FeedbackCategory[] = ["General", "Academics", "Facilities", "Events", "Staff", "Other"];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="36" height="36">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
  </svg>
);

export default function FeedbackForm() {
  const { form, errors, status, serverError, setCategory, setRating, setAnon, change, submit, reset } = useFeedbackForm();

  /* ── Success ── */
  if (status === "success") {
    return (
      <div className="fb-success" role="status" aria-live="polite">
        <div className="fb-success__icon"><CheckIcon /></div>
        <h3>Thank You!</h3>
        <p>Your feedback has been submitted successfully. We really appreciate your time.</p>
        <button type="button" className="fb-btn fb-btn-outline" onClick={reset}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form className="fb-form" onSubmit={submit} noValidate>
      {serverError && (
        <div className="fb-server-error" role="alert">{serverError}</div>
      )}

      {/* Category pills */}
      <div className="fb-field">
        <label className="fb-label">Category</label>
        <div className="fb-pills" role="group" aria-label="Feedback category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`fb-pill${form.category === cat ? " fb-pill--active" : ""}`}
              onClick={() => setCategory(cat)}
              aria-pressed={form.category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Star rating */}
      <div className={`fb-field${errors.rating ? " fb-field--error" : ""}`}>
        <label className="fb-label">
          Overall rating <span className="fb-req" aria-hidden="true">*</span>
        </label>
        <StarRating value={form.rating} onChange={setRating} />
        {errors.rating && <span className="fb-error" role="alert">{errors.rating}</span>}
      </div>

      {/* Name (optional unless anonymous) */}
      {!form.anonymous && (
        <div className="fb-field">
          <label htmlFor="fb-name" className="fb-label">Your name <span className="fb-optional">(optional)</span></label>
          <input
            id="fb-name"
            type="text"
            className="fb-input"
            placeholder="How should we address you?"
            autoComplete="name"
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            maxLength={80}
          />
        </div>
      )}

      {/* Email (optional) */}
      {!form.anonymous && (
        <div className={`fb-field${errors.email ? " fb-field--error" : ""}`}>
          <label htmlFor="fb-email" className="fb-label">Email <span className="fb-optional">(optional, for follow-up)</span></label>
          <input
            id="fb-email"
            type="email"
            className="fb-input"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => change("email", e.target.value)}
          />
          {errors.email && <span className="fb-error" role="alert">{errors.email}</span>}
        </div>
      )}

      {/* Message */}
      <div className={`fb-field${errors.message ? " fb-field--error" : ""}`}>
        <label htmlFor="fb-message" className="fb-label">
          Your feedback <span className="fb-req" aria-hidden="true">*</span>
        </label>
        <textarea
          id="fb-message"
          className="fb-input fb-textarea"
          placeholder="Share your suggestions, concerns or appreciation…"
          required
          aria-required="true"
          rows={5}
          value={form.message}
          onChange={(e) => change("message", e.target.value)}
          aria-invalid={!!errors.message}
        />
        {errors.message && <span className="fb-error" role="alert">{errors.message}</span>}
      </div>

      {/* Anonymous toggle */}
      <div className="fb-field fb-field--inline">
        <label className="fb-toggle" htmlFor="fb-anon">
          <input
            id="fb-anon"
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => setAnon(e.target.checked)}
          />
          <span className="fb-toggle__track" aria-hidden="true" />
          Submit anonymously
        </label>
        <span className="fb-toggle-hint">Your name and email will not be stored.</span>
      </div>

      <button
        type="submit"
        className="fb-btn fb-btn-primary fb-btn-lg"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : (<>Submit Feedback <SendIcon /></>)}
      </button>
    </form>
  );
}
