"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import type { AlumniPageSettings } from "@/types/alumni-page-settings";
import type { Alumni } from "@/types/alumni";
import "../about/legacy/legacy.css";
import "./alumni.css";

const pathIcons: Record<
  AlumniPageSettings["careerPaths"][number]["iconType"],
  ReactNode
> = {
  bank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Z" />
      <path d="M5 13v6c0 1.5 3 2.5 7 2.5s7-1 7-2.5v-6" />
    </svg>
  ),
  tech: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  entrepreneurship: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4Z" />
      <path d="m2 8 8 6 4-3 8 5" />
    </svg>
  ),
};

export default function AlumniClient({
  settings,
  alumni,
}: {
  settings: AlumniPageSettings;
  alumni: Alumni[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = rootRef.current?.querySelectorAll(".reveal");
    if (!items?.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pcm-alumni">
      <section className="page-hero">
        <svg
          className="page-hero__peaks"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>{" "}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>{" "}
            <span>{settings.heroTitle}</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide split">
          <div className="reveal">
            <span className="eyebrow">{settings.familyEyebrow}</span>
            <h2 className="section-title">{settings.familyTitle}</h2>
            {settings.familyParagraphs.map((p, i) => (
              <p key={i} style={i === 0 ? { marginTop: "1rem" } : undefined}>
                {p}
              </p>
            ))}
            {settings.familyPills.length > 0 && (
              <div className="pill-row" style={{ marginTop: "1.4rem" }}>
                {settings.familyPills.map((pill) => (
                  <span className="pill" key={pill}>
                    {pill}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="split__media reveal">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <Image
                className="split-media-img"
                src={settings.familyImageSrc}
                alt={settings.familyImageAlt}
                width={800}
                height={600}
                loading="lazy"
              />
            </div>
            <div className="est-badge">
              <b>{settings.badgeValue}</b>
              <span>{settings.badgeLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.spotlightEyebrow}</span>
            <h2 className="section-title">{settings.spotlightTitle}</h2>
            <p className="section-sub">{settings.spotlightSubtitle}</p>
          </div>
          <div className="grid g-4" style={{ marginTop: "2rem" }}>
            {alumni.map((person, i) => {
              const program = `${person.program} • ${person.batch}`;
              return (
                <article key={person.id} className="alumni-card reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                  <div className="alumni-card__photo">
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        sizes="200px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : null}
                  </div>
                  <h3>{person.name}</h3>
                  <small className="alumni-card__prog">{program}</small>
                  <span className="alumni-card__role">{person.role}</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">{settings.pathsEyebrow}</span>
            <h2 className="section-title">{settings.pathsTitle}</h2>
          </div>
          <div className="grid g-4">
            {settings.careerPaths.map((path, i) => (
              <div key={path.id} className="card icon-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="icon-card__icon" style={{ background: path.iconBg, color: path.iconColor }}>
                  {pathIcons[path.iconType]}
                </div>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">{settings.ctaEyebrow}</span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg" href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel}{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a className="btn btn-ghost on-dark btn-lg" href={settings.ctaSecondaryHref}>
                  {settings.ctaSecondaryLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}