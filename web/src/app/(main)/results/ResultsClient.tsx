"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Pagination from "../Pagination";
import "../pcm-pages.css";

const FileIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
);
const ArrowRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);

const results = [
  { cat: "bba", meta: "BBA · 8th Semester · Published 15 Jul 2026", title: "BBA 8th Semester Result - 2082", href: "/assets/pdf/bba-8th-semester-2082.pdf" },
  { cat: "bcsit", meta: "BCSIT · 3rd Semester · Published 28 Jun 2026", title: "BCSIT 3rd Semester Result - 2082", href: "/assets/pdf/bcsit-3rd-semester-2082.pdf" },
  { cat: "bba-finance", meta: "BBA-Finance · 5th Semester · Published 12 Jun 2026", title: "BBA-Finance 5th Semester Result - 2082", href: "/assets/pdf/bba-finance-5th-semester-2082.pdf" },
  { cat: "bba", meta: "BBA · 6th Semester · Published 02 Jun 2026", title: "BBA 6th Semester Result - 2082", href: "/assets/pdf/bba-6th-semester-2082.pdf" },
  { cat: "bcsit", meta: "BCSIT · 1st Semester · Published 28 May 2026", title: "BCSIT 1st Semester Result - 2082", href: "/assets/pdf/bcsit-1st-semester-2082.pdf" },
  { cat: "bba-finance", meta: "BBA-Finance · 3rd Semester · Published 20 May 2026", title: "BBA-Finance 3rd Semester Result - 2082", href: "/assets/pdf/bba-finance-3rd-semester-2082.pdf" },
  { cat: "bba", meta: "BBA · 4th Semester · Published 12 May 2026", title: "BBA 4th Semester Result - 2082", href: "/assets/pdf/bba-4th-semester-2082.pdf" },
  { cat: "bcsit", meta: "BCSIT · 5th Semester · Published 05 May 2026", title: "BCSIT 5th Semester Result - 2081", href: "/assets/pdf/bcsit-5th-semester-2081.pdf" },
  { cat: "bba", meta: "BBA · 7th Semester · Published 12 Apr 2026", title: "BBA 7th Semester Result - 2081", href: "/assets/pdf/bba-7th-semester-2081.pdf" },
  { cat: "bba-finance", meta: "BBA-Finance · 7th Semester · Published 05 Apr 2026", title: "BBA-Finance 7th Semester Result - 2081", href: "/assets/pdf/bba-finance-7th-semester-2081.pdf" },
  { cat: "bcsit", meta: "BCSIT · 7th Semester · Published 28 Mar 2026", title: "BCSIT 7th Semester Result - 2081", href: "/assets/pdf/bcsit-7th-semester-2081.pdf" },
];

const popular = [
  { day: "15", month: "Jul", title: "BBA 8th Semester Result - 2082", href: "/assets/pdf/bba-8th-semester-2082.pdf", views: "4.1k views" },
  { day: "28", month: "Jun", title: "BCSIT 3rd Semester Result - 2082", href: "/assets/pdf/bcsit-3rd-semester-2082.pdf", views: "2.7k views" },
  { day: "12", month: "Jun", title: "BBA-Finance 5th Semester Result - 2082", href: "/assets/pdf/bba-finance-5th-semester-2082.pdf", views: "2.3k views" },
  { day: "02", month: "Jun", title: "BBA 6th Semester Result - 2082", href: "/assets/pdf/bba-6th-semester-2082.pdf", views: "2.0k views" },
];

const PER_PAGE = 10;

export default function ResultsClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"latest" | "popular">("latest");
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("all");
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
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const filtered = results.filter((r) => {
    const matchesProgram = program === "all" || r.cat === program;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || r.title.toLowerCase().includes(q);
    return matchesProgram && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div ref={rootRef} className="pcm-page">
      <main id="main">
        <section className="page-hero">
          <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2"/><path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45"/></svg>
          <div className="wrap-wide page-hero__inner">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg> <span>Results</span></nav>
            <h1>Results</h1>
            <p>Semester results and marksheets for PCM students - published and verified by Pokhara University.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide" style={{ maxWidth: 900 }}>
            <div className="section-head reveal"><span className="eyebrow">Examinations</span><h2 className="section-title">Latest results</h2></div>

            <div className="tabs reveal">
              <div className="tabs__list" role="tablist">
                <button type="button" role="tab" className="tabs__btn" aria-selected={tab === "latest"} onClick={() => setTab("latest")}>Latest</button>
                <button type="button" role="tab" className="tabs__btn" aria-selected={tab === "popular"} onClick={() => setTab("popular")}>Popular</button>
              </div>

              <div className={`tabs__panel${tab === "latest" ? " active" : ""}`}>
                  <div className="page-tools">
                    <label className="page-tools__search">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                      <input type="search" placeholder="Search results..." aria-label="Search results..." value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
                    </label>
                    <select className="page-tools__select" aria-label="Filter by program" value={program}
                      onChange={(e) => { setProgram(e.target.value); setPage(1); }}>
                      <option value="all">All programs</option>
                      <option value="bba">BBA</option>
                      <option value="bba-finance">BBA-Finance</option>
                      <option value="bcsit">BCSIT</option>
                    </select>
                    <span className="page-tools__count">{filtered.length} of {results.length} shown</span>
                  </div>

                  <div className="result-list" style={{ marginTop: "1.8rem" }}>
                    {visible.map((r) => (
                      <article key={r.title} className="card result-item reveal is-inview">
                        <span className="result-item__file">{FileIcon}</span>
                        <div>
                          <span className="result-item__meta">{r.meta}</span>
                          <h3><a href={r.href}>{r.title}</a></h3>
                        </div>
                        <span className="result-item__tag news-card__tag">PDF</span>
                      </article>
                    ))}
                  </div>
                  <Pagination page={current} total={totalPages} onChange={setPage} />
                </div>
              <div className={`tabs__panel${tab === "popular" ? " active" : ""}`}>
                <div className="notice-list">
                  <div className="notice-list__head"><h3>Most viewed results</h3></div>
                  {popular.map((p) => (
                    <div key={p.title} className="notice-item">
                      <div className="notice-item__cal"><b>{p.day}</b><span>{p.month}</span></div>
                      <div>
                        <h4><a href={p.href}>{p.title}</a></h4>
                        <small>{p.views}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: "2rem", padding: "2rem", textAlign: "center" }}>
              <h3>Official results portal</h3>
              <p style={{ color: "var(--muted)", margin: ".5rem 0 1.2rem" }}>Semester results and marksheets are published by Pokhara University. Students can verify their grades on the official portal.</p>
              <a className="btn btn-primary" href="https://results.pu.edu.np/" target="_blank" rel="noopener">Visit results.pu.edu.np {ArrowRight}</a>
            </div>
          </div>
        </section>

        <section className="cta-section"><div className="wrap-wide"><div className="cta-band reveal">
          <div className="cta-band__inner">
            <div>
              <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
              <h2>A step towards your future</h2>
              <p>Applications for the 2083 intake are open across all three programs. Take the first step today.</p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-gold btn-lg" href="/admission">Apply Now {ArrowRight}</Link>
              <Link className="btn btn-ghost on-dark btn-lg" href="/programs">Explore Programs</Link>
            </div>
          </div>
        </div></div></section>
      </main>
    </div>
  );
}
