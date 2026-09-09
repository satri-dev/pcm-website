/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NewsPageSettings } from "@/types/news-page-settings";
import type { News } from "@/types/news";
import type { Notice } from "@/types/notices";
import Pagination from "../Pagination";
import "../pcm-pages.css"

interface Props {
  settings: NewsPageSettings;
  newsItems: News[];
  notices: Notice[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function noticeDates(notices: Notice[], limit = 5) {
  return notices.slice(0, limit).map((n) => {
    const d = new Date(`${n.date}T00:00:00`);
    return {
      slug: n.slug,
      title: n.title,
      day: String(d.getDate()).padStart(2, "0"),
      month: MONTHS[d.getMonth()] ?? "",
      ts: d.getTime(),
    };
  });
}

function relativeTime(ts: number) {
  const diffMs = Date.now() - ts;
  const days = Math.floor(diffMs / 86400000);
  if (days >= 365) return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
  if (days >= 30) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  return "today";
}

const ArrowRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);

function truncateExcerpt(html: string, max = 100) {
  const text = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}.......`;
}

export default function NewsClient({ settings, newsItems, notices }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [agoMap, setAgoMap] = useState<Record<string, string>>({});

  const featured = newsItems[0];
  const stories = newsItems.slice(1);
  const PER_PAGE = 10;
  const sidebarNotices = noticeDates(notices);

  useEffect(() => {
    const map: Record<string, string> = {};
    noticeDates(notices).forEach((n) => {
      map[n.slug] = relativeTime(n.ts);
    });
    setAgoMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(stories.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = stories.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div ref={rootRef} className="pcm-page">
      <main id="main">
        <section className="page-hero">
          <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2"/><path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45"/></svg>
          <div className="wrap-wide page-hero__inner">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg> <span>News &amp; Notices</span></nav>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroSubtitle}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <Link className="card news-featured reveal" href={`/news/${featured.slug}`}>
              <div className="news-featured__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image || "/assets/img/news-default.jpg"} alt="BBA student Prabhat awarded entrepreneurship grant" loading="lazy" />
                <span className="news-card__date"><b>{featured.publishedAt || ""}</b></span>
              </div>
              <div className="news-featured__body">
                <span className="news-card__tag">{settings.featuredEyebrow} · {featured.category || "News"}</span>
                <h2>{featured.title}</h2>
                <p className="prose prose-sm max-w-none">{truncateExcerpt(featured.excerpt)}</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="section tone-sky">
          <div className="wrap-wide with-aside">
            <div>
              <div className="section-head reveal"><span className="eyebrow">{settings.storiesEyebrow}</span><h2 className="section-title">{settings.storiesTitle}</h2></div>
              <div className="grid g-2" style={{ marginTop: "1.8rem" }}>
                {visible.map((s, i) => (
                  <article key={s.slug} className="card news-card reveal is-inview" style={{ transitionDelay: `${i * 70}ms` }}>
                    <Link href={`/news/${s.slug}`} className="news-card__media" aria-label={s.title}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image || "/assets/img/news-default.jpg"} alt={s.title} loading="lazy" />
                      <span className="news-card__date">{s.publishedAt || ""}</span>
                    </Link>
                    <div className="news-card__body">
                      <span className="news-card__tag">{s.category || "News"}</span>
                      <h3><Link href={`/news/${s.slug}`}>{s.title}</Link></h3>
                      <p className="prose prose-sm max-w-none">{truncateExcerpt(s.excerpt)}</p>
                    </div>
                  </article>
                ))}
              </div>
              <Pagination page={current} total={totalPages} onChange={setPage} />
            </div>

            <aside className="reveal">
              <div className="notice-list">
                <div className="notice-list__head"><h3>{settings.sidebarNoticesTitle}</h3></div>
                {sidebarNotices.map((n) => (
                  <div key={n.slug + n.title} className="notice-item">
                    <div className="notice-item__cal"><b>{n.day}</b><span>{n.month}</span></div>
                    <div>
                      <Link href="/notices"><h4>{n.title}</h4></Link>
                      <small>{agoMap[n.slug] || "recent"}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="aside-card" style={{ marginTop: "1.4rem", position: "static" }}>
                <h3>{settings.newsletterTitle}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".92rem" }}>{settings.newsletterText}</p>
                <form style={{ marginTop: ".8rem" }} onSubmit={(e) => { e.preventDefault(); setSubscribed(true); setEmail(""); }}>
                  <div className={`form-success${subscribed ? " is-visible" : ""}`} style={{ padding: ".7rem 1rem", fontSize: ".85rem" }}>
                    Subscribed! Watch your inbox for updates.
                  </div>
                  <div className="field" style={{ margin: ".6rem 0" }}>
                    <input type="email" placeholder="Your email" required value={email}
                      onChange={(e) => setEmail(e.target.value)} aria-label="Your email" />
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Subscribe</button>
                </form>
              </div>
            </aside>
          </div>
        </section>

        <section className="section"><div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">{settings.ctaEyebrow}</span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <Link className="btn btn-gold btn-lg" href={settings.ctaPrimaryHref}>{settings.ctaPrimaryLabel} {ArrowRight}</Link>
                <Link className="btn btn-ghost on-dark btn-lg" href={settings.ctaSecondaryHref}>{settings.ctaSecondaryLabel}</Link>
              </div>
            </div>
          </div>
        </div></section>
      </main>
    </div>
  );
}
