"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Pagination from "../Pagination";
import "../pcm-pages.css";
import type { NoticesPageSettings } from "@/types/notices-page-settings";
import type { Notice as DbNotice } from "@/types/notices";

const PER_PAGE = 10;

interface Props {
  settings: NoticesPageSettings;
  noticeItems: DbNotice[];
}

export default function NoticesClient({ settings, noticeItems }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"latest" | "popular">("latest");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [page, setPage] = useState(1);

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
      { threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const popular = noticeItems.slice(0, 5).map(n => ({
    day: n.date?.slice(8, 10) || "",
    month: n.date?.slice(5, 7) || "",
    title: n.title,
    href: n.fileUrl || "#",
    views: `${n.views ?? 0} views`,
  }));

  const filtered = noticeItems.filter((n) => {
    const matchesCat = cat === "all" || n.category?.toLowerCase() === cat;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${n.title} ${n.description || ""}`.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div ref={rootRef} className="pcm-page">
      <main id="main">
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
              <span>Notices</span>
            </nav>
            <h1>{settings.heroTitle}</h1>
            <p>
              {settings.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide" style={{ maxWidth: 900 }}>
            <div className="section-head reveal">
              <span className="eyebrow">{settings.sectionEyebrow}</span>
              <h2 className="section-title">{settings.sectionTitle}</h2>
            </div>
            <div className="tabs reveal">
              <div className="tabs__list" role="tablist">
                <button
                  type="button"
                  role="tab"
                  className="tabs__btn"
                  aria-selected={tab === "latest"}
                  onClick={() => setTab("latest")}
                >
                  Latest
                </button>
                <button
                  type="button"
                  role="tab"
                  className="tabs__btn"
                  aria-selected={tab === "popular"}
                  onClick={() => setTab("popular")}
                >
                  Popular
                </button>
              </div>

              <div
                className={`tabs__panel${tab === "latest" ? " active" : ""}`}
              >
                <div className="page-tools">
                  <label className="page-tools__search">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="search"
                      placeholder="Search notices..."
                      aria-label="Search notices..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                    />
                  </label>
                  <select
                    className="page-tools__select"
                    aria-label="Filter by category"
                    value={cat}
                    onChange={(e) => {
                      setCat(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">All categories</option>
                    <option value="notice">Notice</option>
                    <option value="admission">Admission</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="results">Results</option>
                    <option value="events">Events</option>
                  </select>
                  <span className="page-tools__count">
                    {filtered.length} of {noticeItems.length} shown
                  </span>
                </div>

                <div className="notice-list" style={{ marginTop: "1.25rem" }}>
                  {visible.map((n, i) => (
                    <article
                      key={n.title}
                      className="card notice-item reveal is-inview"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <div className="notice-item__body">
                        <span className="news-card__tag">{n.category || "Notice"}</span>
                        <h3>
                          <a href={n.fileUrl || "#"}>{n.title}</a>
                        </h3>
                        <p>{n.description || ""}</p>
                      </div>
                      <div className="notice-item__date">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {n.date}
                      </div>
                    </article>
                  ))}
                </div>
                <Pagination
                  page={current}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
              <div
                className={`tabs__panel${tab === "popular" ? " active" : ""}`}
              >
                <div className="notice-list">
                  <div className="notice-list__head">
                    <h3>Most viewed notices</h3>
                  </div>
                  {popular.map((p) => (
                    <div key={p.title} className="notice-item has-cal">
                      <div className="notice-item__cal">
                        <b>{p.day}</b>
                        <span>{p.month}</span>
                      </div>
                      <div>
                        <h4>
                          <a href={p.href}>{p.title}</a>
                        </h4>
                        <small>{p.views}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                marginTop: "2rem",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <h3>{settings.subscribeTitle}</h3>
              <p style={{ color: "var(--muted)", margin: ".5rem 0 1.2rem" }}>
                {settings.subscribeText}
              </p>
              <Link className="btn btn-primary" href="/contact">
                Contact the Administration{" "}
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

        <section className="cta-section">
          <div className="wrap-wide">
            <div className="cta-band reveal">
              <div className="cta-band__inner">
                <div>
                  <span className="eyebrow on-dark">
                    {settings.ctaEyebrow}
                  </span>
                  <h2>{settings.ctaTitle}</h2>
                  <p>
                    {settings.ctaText}
                  </p>
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
                  <Link
                    className="btn btn-ghost on-dark btn-lg"
                    href={settings.ctaSecondaryHref}
                  >
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
