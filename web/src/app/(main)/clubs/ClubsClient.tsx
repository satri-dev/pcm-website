"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "../about/legacy/legacy.css";
import "./clubs.css";
import type { ClubsPageSettings } from "@/types/clubs-page-settings";

const IMG = "/assets/img";

interface ClubMemberApi {
  photo: string;
  name: string;
  position: string;
  program: string;
}

interface ClubApi {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  image: string;
  desc: string;
  members: ClubMemberApi[];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function ClubsClient({
  settings,
  clubs,
}: {
  settings: ClubsPageSettings;
  clubs: ClubApi[];
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
  }, [clubs]);

  const clubCount = clubs.length;

  return (
    <div ref={rootRef} className="pcm-clubs">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
            <span>Student Clubs</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide split reverse">
          <div className="split__media reveal">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <img className="split-media-img" src={settings.whyImage} alt={settings.whyImageAlt} loading="lazy" />
            </div>
            <div className="est-badge"><b>{settings.whyBadgeValue}</b><span>{settings.whyBadgeLabel}</span></div>
          </div>
          <div className="reveal">
            <span className="eyebrow">{settings.whyEyebrow}</span>
            <h2 className="section-title">{settings.whyTitle}</h2>
            <p style={{ marginTop: "1rem" }}>{settings.whyParagraph}</p>
            <ul className="checklist" style={{ marginTop: "1.2rem" }}>
              {settings.whyChecklist.map((item) => (
                <li key={item}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">{clubCount > 0 ? `${clubCount} ${clubCount === 1 ? "club" : "clubs"}, one community` : settings.clubsEyebrow}</span>
            <h2 className="section-title">{settings.clubsTitle}</h2>
            <p className="section-sub">{settings.clubsSubtitle}</p>
          </div>
          <div className="grid g-3" style={{ marginTop: "2rem" }}>
            {clubs.length === 0 ? (
              <p style={{ padding: "2rem 0", color: "var(--muted)" }}>No clubs listed yet.</p>
            ) : (
              clubs.map((club, i) => (
                <article key={club.id} className="club-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="club-card__head">
                    <span className="club-card__icon">{club.icon}</span>
                    <div>
                      <h3>{club.name}</h3>
                      <p>{club.tagline}</p>
                    </div>
                  </div>
                  <div className="club-card__members">
                    {club.members.length === 0 ? (
                      <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: 0 }}>Club member details coming soon.</p>
                    ) : (
                      club.members.map((m) => (
                        <div key={m.name} className="club-member">
                          {m.photo ? (
                            <img className="club-member__photo" src={m.photo} alt={m.name} loading="lazy" />
                          ) : (
                            <span className="club-member__photo club-member__photo--ph">{initials(m.name)}</span>
                          )}
                          <div className="club-member__info">
                            <b>{m.name}</b>
                            <span className="club-member__role">{m.position}</span>
                            <small className="club-member__prog">{m.program}</small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <Link className="btn btn-gold btn-lg " href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <Link className="btn btn-ghost on-dark btn-lg" href={settings.ctaSecondaryHref}>{settings.ctaSecondaryLabel}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
