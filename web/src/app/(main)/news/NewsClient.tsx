"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { newsData } from "@/data/news";
import Pagination from "../Pagination";
import "../pcm-pages.css"

const featured = newsData[0];
const stories = newsData.slice(1);
const PER_PAGE = 10;

const officialNotices = [
  { day: "06", month: "Jul", title: "Admissions open for BBA, BBA-Finance & BCSIT - 2083 intake", ago: "1 month ago" },
  { day: "24", month: "Jun", title: "Entrance examination schedule published for all programs", ago: "2 months ago" },
  { day: "10", month: "Jun", title: "Scholarship applications now being accepted for new students", ago: "2 months ago" },
  { day: "28", month: "May", title: "Semester examination routine released by Pokhara University", ago: "3 months ago" },
];

const ArrowRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);

export default function NewsClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

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
            <h1>News &amp; Notices</h1>
            <p>Achievements, events and official announcements from across the PCM campus.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <Link className="card news-featured reveal" href={`/news/${featured.slug}`}>
              <div className="news-featured__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image} alt="BBA student Prabhat awarded entrepreneurship grant" loading="lazy" />
                <span className="news-card__date"><b>24</b>Jul 2026</span>
              </div>
              <div className="news-featured__body">
                <span className="news-card__tag">Featured · Achievement</span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="link-arrow">Read the full story {ArrowRight}</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="section tone-sky">
          <div className="wrap-wide with-aside">
            <div>
              <div className="section-head reveal"><span className="eyebrow">Newsroom</span><h2 className="section-title">More stories</h2></div>
              <div className="grid g-2" style={{ marginTop: "1.8rem" }}>
                {visible.map((s, i) => (
                  <article key={s.slug} className="card news-card reveal is-inview" style={{ transitionDelay: `${i * 70}ms` }}>
                    <Link href={`/news/${s.slug}`} className="news-card__media" aria-label={s.title}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={s.title} loading="lazy" />
                      <span className="news-card__date">{s.date}</span>
                    </Link>
                    <div className="news-card__body">
                      <span className="news-card__tag">{s.tag}</span>
                      <h3><Link href={`/news/${s.slug}`}>{s.title}</Link></h3>
                      <p>{s.excerpt}</p>
                      <div className="news-card__foot"><Link className="link-arrow" href={`/news/${s.slug}`}>Read story {ArrowRight}</Link></div>
                    </div>
                  </article>
                ))}
              </div>
              <Pagination page={current} total={totalPages} onChange={setPage} />
            </div>

            <aside className="reveal">
              <div className="notice-list">
                <div className="notice-list__head"><h3>Official Notices</h3></div>
                {officialNotices.map((n) => (
                  <div key={n.title} className="notice-item">
                    <div className="notice-item__cal"><b>{n.day}</b><span>{n.month}</span></div>
                    <div>
                      <h4>{n.title}</h4>
                      <small>{n.ago}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="aside-card" style={{ marginTop: "1.4rem", position: "static" }}>
                <h3>Stay updated</h3>
                <p style={{ color: "var(--muted)", fontSize: ".92rem" }}>Follow PCM on social media or subscribe to receive notices in your inbox.</p>
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
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>A step towards your future</h2>
                <p>Applications for the 2083 intake are open across all three programs. Take the first step today.</p>
              </div>
              <div className="cta-band__actions">
                <Link className="btn btn-gold btn-lg" href="/admission">Apply Now {ArrowRight}</Link>
                <Link className="btn btn-ghost on-dark btn-lg" href="/about">More Info</Link>
              </div>
            </div>
          </div>
        </div></section>
      </main>
    </div>
  );
}
