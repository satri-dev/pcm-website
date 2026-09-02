"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import "./about.css";
import type { AboutPageSettings, VmvCard, DiffItem } from "@/types/about-page-settings";
import type { HomepageTestimonial } from "@/types/homepage";

const vmvIcons: Record<VmvCard["iconType"], ReactNode> = {
  vision: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  ),
  values: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9Z" />
      <path d="M2 9h20M12 3 8 9l4 12 4-12-4-6" />
    </svg>
  ),
  mission: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  ),
};

const diffIcons: Record<DiffItem["iconType"], ReactNode> = {
  faculty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  lectures: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4" />
    </svg>
  ),
  "it-courses": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
    </svg>
  ),
  extracurriculars: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
  industry: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  ),
  "student-care": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default function AboutClient({
  settings,
  testimonials,
}: {
  settings: AboutPageSettings;
  testimonials: HomepageTestimonial[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [page, setPage] = useState(1);

  const perPage = settings.voicesPerPage > 0 ? settings.voicesPerPage : 4;
  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const visible = useMemo(() => {
    const start = (page - 1) * perPage;
    return testimonials.slice(start, start + perPage);
  }, [testimonials, page, perPage]);

  const selectAchiever = (idx: number) => {
    setActiveIdx(idx);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }

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
    <div ref={rootRef} className="pcm-about">
      <main id="main">
        {/* ── Hero ── */}
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
              <Link href="/">Home</Link>{" "}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>{" "}
              <span>About Us</span>
            </nav>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroSubtitle}</p>
          </div>
        </section>

        {/* ── Who we are (split) ── */}
        <section className="section">
          <div className="wrap-wide split">
            <div className="reveal">
              <span className="eyebrow">{settings.whoEyebrow}</span>
              <h2 className="section-title">{settings.whoTitle}</h2>
              {settings.whoParagraphs.map((p, i) => (
                <p key={i} style={i === 0 ? { marginTop: "1rem" } : undefined}>
                  {p}
                </p>
              ))}
              {settings.whoPills.length > 0 && (
                <div className="pill-row" style={{ marginTop: "1.4rem" }}>
                  {settings.whoPills.map((pill) => (
                    <span className="pill" key={pill}>
                      {pill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="split__media reveal">
              <div
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-lg)",
                  aspectRatio: "4/3",
                  position: "relative",
                }}
              >
                <Image
                  src={settings.whoImageSrc}
                  alt={settings.whoImageAlt}
                  fill
                  className="split-media-img"
                  sizes="(max-width: 820px) 100vw, 50vw"
                />
              </div>
              <div className="est-badge">
                <b>{settings.whoBadgeValue}</b>
                <span>{settings.whoBadgeLabel}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why study at PCM (reverse split) ── */}
        <section className="section tone-sky">
          <div className="wrap-wide split reverse">
            <div className="split__media reveal">
              <div
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-lg)",
                  aspectRatio: "4/3",
                  position: "relative",
                }}
              >
                <Image
                  src={settings.whyImageSrc}
                  alt={settings.whyImageAlt}
                  fill
                  className="split-media-img"
                  sizes="(max-width: 820px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="reveal">
              <span className="eyebrow">{settings.whyEyebrow}</span>
              <h2 className="section-title">{settings.whyTitle}</h2>
              {settings.whyParagraphs.map((p, i) => (
                <p key={i} style={i === 0 ? { marginTop: "1rem" } : undefined}>
                  {p}
                </p>
              ))}
              <Link className="btn btn-primary" href={settings.whyCtaHref}>
                {settings.whyCtaLabel}{" "}
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
              </Link>
            </div>
          </div>
        </section>

        {/* ── Vision, Mission & Values ── */}
        <section className="section" id="message">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">{settings.vmvEyebrow}</span>
              <h2 className="section-title">{settings.vmvTitle}</h2>
            </div>
            <div className="grid g-3 mt-7">
              {settings.vmvCards.map((card, i) => (
                <div
                  key={card.id}
                  className="feature reveal"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div
                    className="feature__ic"
                    style={{ background: card.iconBg, color: card.iconColor }}
                  >
                    {vmvIcons[card.iconType]}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What makes us different ── */}
        <section className="section tone-sky" id="board">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">{settings.diffEyebrow}</span>
              <h2 className="section-title">{settings.diffTitle}</h2>
            </div>
            <ul
              className="icon-list grid g-2 mt-7"
              style={{ gap: "1.6rem" }}
            >
              {settings.diffItems.map((item, i) => (
                <li
                  key={item.id}
                  className="reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div
                    className="icon-list__ic"
                    style={{ background: item.iconBg, color: item.iconColor }}
                  >
                    {diffIcons[item.iconType]}
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="stats section">
          <div className="wrap-wide">
            <div
              className="section-head center reveal"
              style={{ maxWidth: "560px", marginInline: "auto" }}
            >
              <span className="eyebrow on-dark">{settings.statsEyebrow}</span>
              <h2 className="section-title" style={{ color: "#fff" }}>
                {settings.statsTitle}
              </h2>
            </div>
            <div className="stats__grid mt-7">
              {settings.stats.map((stat) => (
                <div className="stat" key={stat.id}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Achievers / Testimonials ── */}
        {visible.length > 0 && (
          <section className="section tone-sky">
            <div className="wrap">
              <div className="section-head center reveal">
                <span className="eyebrow">{settings.voicesEyebrow}</span>
                <h2 className="section-title">{settings.voicesTitle}</h2>
                <p className="section-sub">{settings.voicesSubtitle}</p>
              </div>
              <div className="achv reveal mt-7">
                <div className="achv__spot">
                  <Image
                    className="achv__photo"
                    src={visible[activeIdx].photo}
                    alt={`Photo of ${visible[activeIdx].name}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 55vw"
                  />
                  <p className="achv__quote">{visible[activeIdx].quote}</p>
                  <div className="achv__name">{visible[activeIdx].name}</div>
                  <div className="achv__role">{visible[activeIdx].role}</div>
                </div>
                <div className="achv__list">
                  {visible.map((a, i) => (
                    <button
                      key={a.id}
                      className={`achv__item${i === activeIdx ? " is-active" : ""}`}
                      type="button"
                      onClick={() => selectAchiever(i)}
                    >
                      <Image
                        src={a.photo}
                        alt=""
                        width={52}
                        height={52}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span>
                        <b>{a.name}</b>
                        <small>{a.role}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="pagination" style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`btn ${n === page ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CTA band ── */}
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
                  <Link className="btn btn-gold btn-lg" href={settings.ctaPrimaryHref}>
                    {settings.ctaPrimaryLabel}{" "}
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
                  </Link>
                  <Link className="btn btn-ghost on-dark btn-lg" href={settings.ctaSecondaryHref}>
                    {settings.ctaSecondaryLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
