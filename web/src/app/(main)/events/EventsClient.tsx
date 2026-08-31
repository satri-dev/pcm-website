"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EventsPageSettings } from "@/types/events-page-settings";
import type { EventItem as DbEventItem } from "@/types/events";
import Pagination from "../Pagination";
import "../pcm-pages.css";

interface Props {
  settings: EventsPageSettings;
  eventItems: DbEventItem[];
}

const TYPE_ICONS: Record<string, string> = {
  Workshop: "\u{1F6E0}\uFE0F",
  Seminar: "\u{1F3A4}",
  Festival: "\u{1F389}",
  Tour: "\u{1F3D4}\uFE0F",
  Sports: "\u{1F3C6}",
};

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_UPPER = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function parts(date: string) {
  const [y, m, d] = date.split("-").map((p) => parseInt(p, 10));
  return { y, m, d };
}

function fmtDate(date: string) {
  const { y, m, d } = parts(date);
  if (!y || !m || !d) return date;
  return `${MONTHS_SHORT[m - 1]} ${d}, ${y}`;
}

const PinIcon = (
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
);
const UsersIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CalIcon = (
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
);
const ArrowRight = (
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
);

const PER_PAGE = 10;

export default function EventsClient({ settings, eventItems }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
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

  const totalPages = Math.max(1, Math.ceil(eventItems.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = eventItems.slice((current - 1) * PER_PAGE, current * PER_PAGE);

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
              <Link href="/">Home</Link>
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
              <Link href="/news">News</Link>
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
            </nav>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroSubtitle}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <div className="section-head-row">
              <div className="section-head reveal">
                <span className="eyebrow">{settings.sectionEyebrow}</span>
                <h2 className="section-title">{settings.sectionTitle}</h2>
                <p className="section-sub">
                  {settings.sectionSubtitle}
                </p>
              </div>
              <Link className="btn btn-ghost reveal" href="/contact">
                Ask about an event {ArrowRight}
              </Link>
            </div>

            <div className="events-grid mt-7">
              {visible.map((e, i) => {
                const { m, d } = parts(e.date);
                return (
                  <article
                    key={e.id}
                    className="event-card reveal is-inview"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="event-card__media">
                      <div
                        className="event-card__bg--plain"
                        style={{ height: "100%" }}
                      />
                      <div className="event-card__cal">
                        <b>{d}</b>
                        <span>{MONTHS_UPPER[m - 1]}</span>
                      </div>
                      <span className="event-card__type">
                        {TYPE_ICONS[e.type] ?? "\u{1F4C5}"} {e.type}
                      </span>
                    </div>
                    <div className="event-card__body">
                      <h3>{e.title}</h3>
                      <p className="event-card__desc">{e.description}</p>
                      <div className="event-card__meta">
                        <span>
                          {PinIcon}
                          {e.location}
                        </span>
                        {e.seats ? (
                          <span>
                            {UsersIcon}
                            {e.seats} seats
                          </span>
                        ) : null}
                        <span>
                          {CalIcon}
                          {fmtDate(e.date)}
                        </span>
                      </div>
                    </div>
                    <div className="event-card__foot">
                      <Link
                        className="link-arrow"
                        href={`/contact?subject=${encodeURIComponent(e.title.slice(0, 60))}`}
                      >
                        Enquire {ArrowRight}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            <Pagination page={current} total={totalPages} onChange={setPage} />
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
                    {settings.ctaPrimaryLabel} {ArrowRight}
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
