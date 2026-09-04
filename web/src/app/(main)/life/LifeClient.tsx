"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import "./life.css";
import type { LifePageSettings } from "@/types/life-page-settings";

interface LifeGalleryPhoto {
  image: string;
  title: string;
  tag: string;
}

const iconEvents = [
  <svg key="0" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h5a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></svg>,
];

const iconWorkshops = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 3-4 3 3 5-6" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82" /></svg>,
];

const iconClubs = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5.5 4 3.5 7.5C19 16.65 12 21 12 21Z" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg>,
];

export default function LifeClient({
  settings,
  gallery,
}: {
  settings: LifePageSettings;
  gallery: LifeGalleryPhoto[];
}) {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.85) {
          el.classList.add("revealed");
        }
      });
    };
    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll);
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  const renderCards = (
    cards: { title: string; desc: string }[],
    icons: ReactNode[]
  ) =>
    cards.map((card, i) => (
      <div className="feature reveal" style={{ transitionDelay: `${i * 60}ms` }} key={card.title || i}>
        <div className="feature__ic">{icons[i % icons.length]}</div>
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
      </div>
    ));

  return (
    <main id="main" className="life-page">
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#1C4E8A" opacity=".2"/>
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#143560" opacity=".45"/>
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            <span>Life at PCM</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      <section className="section" id="events">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.eventsEyebrow}</span>
            <h2 className="section-title">{settings.eventsTitle}</h2>
            <p className="section-sub">{settings.eventsSubtitle}</p>
          </div>
          <div className="grid g-2" style={{ marginTop: '2rem', gap: '1.5rem' }}>
            {renderCards(settings.eventCards, iconEvents)}
          </div>
        </div>
      </section>

      <section className="section tone-sky" id="workshops">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.workshopsEyebrow}</span>
            <h2 className="section-title">{settings.workshopsTitle}</h2>
            <p className="section-sub">{settings.workshopsSubtitle}</p>
          </div>
          <div className="grid g-2" style={{ marginTop: '2rem', gap: '1.5rem' }}>
            {renderCards(settings.workshopCards, iconWorkshops)}
          </div>
        </div>
      </section>

      <section className="section" id="clubs">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.clubsEyebrow}</span>
            <h2 className="section-title">{settings.clubsTitle}</h2>
            <p className="section-sub">{settings.clubsSubtitle}</p>
          </div>
          <div className="grid g-4" style={{ marginTop: '2rem' }}>
            {renderCards(settings.clubCards, iconClubs)}
          </div>

          <div className="section-head reveal" style={{ marginTop: '3rem' }}>
            <span className="eyebrow">{settings.galleryEyebrow}</span>
            <h2 className="section-title">{settings.galleryTitle}</h2>
            <p className="section-sub">{settings.gallerySubtitle}</p>
          </div>
          <div className="gallery">
            {gallery.map((photo) => (
              <a className="g-item" href={settings.galleryButtonHref} key={photo.image}>
                <img className="g-item__visual" src={photo.image} alt={photo.title} loading="lazy"/>
                <div className="g-item__overlay">
                  <span className="tag">{photo.tag}</span>
                  <b>{photo.title}</b>
                </div>
              </a>
            ))}
          </div>

          <div className="center" style={{ marginTop: '1.5rem' }}>
            <a className="btn btn-primary" href={settings.galleryButtonHref}>
              {settings.galleryButtonLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z"/>
                <circle cx="12" cy="13" r="3.5"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn • Go Forth to Serve</span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold" href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <a className="btn btn-ghost on-dark" href={settings.ctaSecondaryHref}>{settings.ctaSecondaryLabel}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
