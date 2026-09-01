"use client";

import { useEffect } from "react";
import "./contact.css";
import type { ContactPageContent } from "@/types/page-content";

interface ContactClientProps {
  content: ContactPageContent;
}

export default function ContactClient({ content }: ContactClientProps) {
  // Handle reveal animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll(".pcm-contact .reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main id="main" className="pcm-contact">
      {/* Hero Section */}
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
            <a href="/">Home</a>
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
            <span>Contact Us</span>
          </nav>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.subtitle}</p>
        </div>
      </section>

      {/* Contact Details & Form Section */}
      <section className="section">
        <div className="wrap-wide contact-grid">
          {/* Contact Details */}
          <div className="reveal">
            <span className="eyebrow">Contact details</span>
            <h2 className="section-title">{content.contactDetails.sectionHeading}</h2>
            <p style={{ margin: "1rem 0 1.6rem" }}>{content.contactDetails.sectionBody}</p>
            <div className="contact-info">
              {/* Address */}
              <div className="ci-item reveal">
                <div className="ci-item__ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4>{content.contactDetails.address.label}</h4>
                  <a
                    href={content.contactDetails.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content.contactDetails.address.value}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="ci-item reveal">
                <div className="ci-item__ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4>{content.contactDetails.phone.label}</h4>
                  <a href={`tel:${content.contactDetails.phone.tel}`}>
                    {content.contactDetails.phone.value}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="ci-item reveal">
                <div className="ci-item__ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                </div>
                <div>
                  <h4>{content.contactDetails.email.label}</h4>
                  <a href={`mailto:${content.contactDetails.email.value}`}>
                    {content.contactDetails.email.value}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="ci-item reveal">
                <div className="ci-item__ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
                <div>
                  <h4>{content.contactDetails.hours.label}</h4>
                  <p>{content.contactDetails.hours.value}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal">
            <div className="contact-form-card">
              <h3 className="contact-form-title">{content.contactForm.heading}</h3>
              <form>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label>
                      {content.contactForm.fields.name.label}{" "}
                      <span className="contact-req">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={content.contactForm.fields.name.placeholder}
                    />
                  </div>
                  <div className="contact-field">
                    <label>{content.contactForm.fields.phone.label}</label>
                    <input
                      type="tel"
                      placeholder={content.contactForm.fields.phone.placeholder}
                    />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label>
                      {content.contactForm.fields.email.label}{" "}
                      <span className="contact-req">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={content.contactForm.fields.email.placeholder}
                    />
                  </div>
                  <div className="contact-field">
                    <label>{content.contactForm.fields.subject.label}</label>
                    <select>
                      {content.contactForm.fields.subject.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="contact-field">
                  <label>
                    {content.contactForm.fields.message.label}{" "}
                    <span className="contact-req">*</span>
                  </label>
                  <textarea
                    required
                    placeholder={content.contactForm.fields.message.placeholder}
                  ></textarea>
                </div>
                <button className="contact-btn contact-btn-primary contact-btn-lg" type="submit">
                  {content.contactForm.submitButtonText}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <p className="contact-form-note">{content.contactForm.noteMessage}</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-tight">
        <div className="wrap-wide">
          <div className="map-wrap reveal">
            <iframe
              className="map-iframe"
              title={content.mapEmbed.title}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={content.mapEmbed.embedUrl}
            ></iframe>
            
            {/* Map Overlay Bar */}
            <div className="map-overlay">
              <div className="map-overlay__left">
                <div className="map-overlay__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span className="map-overlay__name">Pokhara College of Management</span>
                  <span className="map-overlay__address">
                    {content.contactDetails.address.value}
                  </span>
                </div>
              </div>
              <a
                href={content.contactDetails.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-overlay__btn map-overlay__btn--directions"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "1rem", height: "1rem" }}
                >
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {content.cta.eyebrow}
                </span>
                <h2>{content.cta.heading}</h2>
                <p>{content.cta.body}</p>
              </div>
              <div className="cta-band__actions">
                <a
                  className="contact-btn contact-btn-gold contact-btn-lg"
                  href={content.cta.buttons.primary.url}
                >
                  {content.cta.buttons.primary.text}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a
                  className="contact-btn contact-btn-ghost-dark contact-btn-lg"
                  href={content.cta.buttons.secondary.url}
                >
                  {content.cta.buttons.secondary.text}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
