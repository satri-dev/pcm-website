"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ContactForm from "@/feature/contact/components/ContactForm";
import ContactInfoCard from "@/feature/contact/components/ContactInfoCard";
import MapEmbed from "@/feature/contact/components/MapEmbed";
import { contactInfoItems } from "@/feature/contact/data/contact";
import "./contact.css";

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function ContactClient() {
  const rootRef = useRef<HTMLDivElement>(null);

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
    <div ref={rootRef} className="pcm-contact">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span>Contact Us</span>
          </nav>
          <h1>Get in Touch</h1>
          <p>
            Questions about admissions, programs or a campus visit? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Info + Form ── */}
      <section className="section">
        <div className="wrap-wide contact-grid">
          {/* Left — contact info */}
          <div className="reveal">
            <span className="eyebrow">Contact details</span>
            <h2 className="section-title" style={{ marginTop: "0.5rem" }}>
              We&apos;re here to help
            </h2>
            <p style={{ margin: "1rem 0 0", color: "var(--body-c)" }}>
              Reach out by phone or email, or drop by our Nadipur campus during
              opening hours. Our admissions team is happy to walk you through
              programs, fees and scholarships.
            </p>
            <div className="contact-info">
              {contactInfoItems.map((item) => (
                <ContactInfoCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Right — form */}
          <ContactForm />
        </div>
      </section>

      {/* ── Map ── */}
      <section className="section-tight">
        <div className="wrap-wide">
          {/*
            MapEmbed is lazy by default — shows a placeholder until the user
            clicks "Load map", avoiding an eager Google request.

            TODO (backend integration):
            Fetch the embedUrl from /api/settings/map-location and pass it as
            a prop here so the admin can update the map location from the panel.
          */}
          <MapEmbed />
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span
                  className="eyebrow"
                  style={{ color: "var(--gold-400)" }}
                >
                  Enter to Learn — Go Forth to Serve
                </span>
                <h2>A step towards your future</h2>
                <p>
                  Applications for the 2083 intake are open across all three
                  programs. Take the first step today.
                </p>
              </div>
              <div className="cta-band__actions">
                <Link
                  className="contact-btn contact-btn-gold contact-btn-lg"
                  href="/admission"
                >
                  Apply Now <ArrowRight />
                </Link>
                <Link
                  className="contact-btn contact-btn-ghost-dark contact-btn-lg"
                  href="/programs"
                >
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
