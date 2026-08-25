"use client";

import { useContactForm } from "../hooks/useContactForm";
import { subjectOptions } from "../data/contact";

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);

export default function ContactForm() {
  const { form, errors, status, serverError, change, submit, reset } =
    useContactForm();

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="contact-form-card">
        <div className="contact-success" role="status" aria-live="polite">
          <div className="contact-success__icon">
            <CheckIcon />
          </div>
          <h3>Message sent!</h3>
          <p>
            Thanks for reaching out. We&apos;ll get back to you within one
            working day.
          </p>
          <button
            className="contact-btn contact-btn-primary"
            onClick={reset}
            style={{ marginTop: "1.25rem" }}
            type="button"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-card reveal">
      <h3 className="contact-form-title">Send us a message</h3>

      {/* Server error banner */}
      {status === "error" && serverError && (
        <div className="contact-server-error" role="alert" aria-live="assertive">
          {serverError}
          <button
            type="button"
            className="contact-server-error__dismiss"
            onClick={reset}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        {/* Row 1: name + phone */}
        <div className="contact-form-row">
          <div className="contact-field">
            <label htmlFor="cf-name">
              Full name{" "}
              <span className="contact-req" aria-hidden="true">*</span>
            </label>
            <input
              id="cf-name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              required
              aria-required="true"
              aria-describedby={errors.fullName ? "cf-name-err" : undefined}
              aria-invalid={!!errors.fullName}
              value={form.fullName}
              onChange={(e) => change("fullName", e.target.value)}
              className={errors.fullName ? "is-error" : ""}
            />
            {errors.fullName && (
              <span id="cf-name-err" className="contact-field-error" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="contact-field">
            <label htmlFor="cf-phone">Phone</label>
            <input
              id="cf-phone"
              type="tel"
              placeholder="98XXXXXXXX"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => change("phone", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: email + subject */}
        <div className="contact-form-row">
          <div className="contact-field">
            <label htmlFor="cf-email">
              Email{" "}
              <span className="contact-req" aria-hidden="true">*</span>
            </label>
            <input
              id="cf-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              aria-required="true"
              aria-describedby={errors.email ? "cf-email-err" : undefined}
              aria-invalid={!!errors.email}
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
              className={errors.email ? "is-error" : ""}
            />
            {errors.email && (
              <span id="cf-email-err" className="contact-field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="contact-field">
            <label htmlFor="cf-subject">Subject</label>
            <select
              id="cf-subject"
              value={form.subject}
              onChange={(e) => change("subject", e.target.value)}
            >
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="contact-field">
          <label htmlFor="cf-message">
            Message{" "}
            <span className="contact-req" aria-hidden="true">*</span>
          </label>
          <textarea
            id="cf-message"
            placeholder="How can we help?"
            required
            aria-required="true"
            aria-describedby={errors.message ? "cf-msg-err" : undefined}
            aria-invalid={!!errors.message}
            value={form.message}
            onChange={(e) => change("message", e.target.value)}
            className={errors.message ? "is-error" : ""}
            rows={5}
          />
          {errors.message && (
            <span id="cf-msg-err" className="contact-field-error" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="contact-btn contact-btn-primary contact-btn-lg"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? (
            "Sending…"
          ) : (
            <>
              Send message <SendIcon />
            </>
          )}
        </button>

        <p className="contact-form-note">
          For urgent enquiries call{" "}
          <a href="tel:061544761">(061) 544761</a> directly.
        </p>
      </form>
    </div>
  );
}
