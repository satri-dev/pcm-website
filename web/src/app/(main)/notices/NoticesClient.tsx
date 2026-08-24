"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Pagination from "../Pagination";
import "../pcm-pages.css";

const notices = [
  {
    cat: "notice",
    tag: "Notice",
    title: "Entrance Examination Schedule - 2083",
    href: "/assets/pdf/entrance-schedule-2083.pdf",
    text: "The Pokhara University entrance examination for the 2083 intake will be held on Ashar 29, 2083 at 8:00 AM. Admit cards are available at the college office.",
    date: "Ashar 21, 2083",
  },
  {
    cat: "admission",
    tag: "Admission",
    title: "Admission Form Deadline",
    href: "/assets/pdf/admission-open-2083.pdf",
    text: "Applications for BBA, BBA-Finance and BCSIT close on Ashar 26, 2083. Apply online or in person before the deadline.",
    date: "Ashar 18, 2083",
  },
  {
    cat: "scholarship",
    tag: "Scholarship",
    title: "Scholarship Applications Open",
    href: "/assets/pdf/scholarship-open-2083.pdf",
    text: "Merit and need-based scholarship applications for the 2083 intake are now open. Submit your supporting documents to the administration office.",
    date: "Ashar 10, 2083",
  },
  {
    cat: "results",
    tag: "Results",
    title: "Semester Result Publication",
    href: "/assets/pdf/semester-result-publication.pdf",
    text: "The results of the recent semester examinations have been published. Students can collect their transcript from the examination section.",
    date: "Ashar 02, 2083",
  },
  {
    cat: "events",
    tag: "Events",
    title: "Annual Fest 2083 Dates Announced",
    href: "/assets/pdf/annual-fest-2083.pdf",
    text: "The annual fest will take place in the third week of Shrawan. Club representatives should meet the faculty coordinator for planning.",
    date: "Jestha 28, 2083",
  },
  {
    cat: "notice",
    tag: "Notice",
    title: "Tuition Fee Structure for 2083",
    href: "/assets/pdf/fee-structure-2083.pdf",
    text: "The approved tuition and fee structure for the 2083 intake has been published. Students and guardians may collect a copy from the administration office.",
    date: "Shrawan 15, 2083",
  },
  {
    cat: "events",
    tag: "Events",
    title: "Annual Sports Day - 2083",
    href: "/assets/pdf/sports-day-2083.pdf",
    text: "PCM's annual sports day will be held on the college grounds. Students from all batches are encouraged to register their teams by the deadline.",
    date: "Shrawan 12, 2083",
  },
  {
    cat: "notice",
    tag: "Notice",
    title: "Library & Reading Room Timings",
    href: "/assets/pdf/library-timings-2083.pdf",
    text: "The library will remain open on weekdays and Saturday mornings during examination season. Revised timings are effective from this week.",
    date: "Shrawan 08, 2083",
  },
  {
    cat: "notice",
    tag: "Notice",
    title: "Campus Picnic & Educational Excursion",
    href: "/assets/pdf/picnic-excursion-2083.pdf",
    text: "The college will organise a combined picnic and educational excursion for all batches next month. Contribution details are available at the student desk.",
    date: "Shrawan 05, 2083",
  },
  {
    cat: "results",
    tag: "Results",
    title: "Mid-Term Examination Routine - 2083",
    href: "/assets/pdf/mid-term-routine-2083.pdf",
    text: "The mid-term examination routine for all programs has been finalised. Subject-wise dates are published and displayed on the notice board.",
    date: "Ashar 30, 2083",
  },
  {
    cat: "notice",
    tag: "Notice",
    title: "Convocation & Degree Distribution - 2081 Batch",
    href: "/assets/pdf/convocation-2081.pdf",
    text: "Graduates of the 2081 batch are invited to collect their degrees and transcripts. Dress code and schedule details are provided in the notice.",
    date: "Ashar 25, 2083",
  },
];

const popular = [
  {
    day: "21",
    month: "Ashar",
    title: "Entrance Examination Schedule - 2083",
    href: "/assets/pdf/entrance-schedule-2083.pdf",
    views: "3.2k views",
  },
  {
    day: "18",
    month: "Ashar",
    title: "Admission Form Deadline",
    href: "/assets/pdf/admission-open-2083.pdf",
    views: "2.8k views",
  },
  {
    day: "10",
    month: "Ashar",
    title: "Scholarship Applications Open",
    href: "/assets/pdf/scholarship-open-2083.pdf",
    views: "2.1k views",
  },
  {
    day: "02",
    month: "Ashar",
    title: "Semester Result Publication",
    href: "/assets/pdf/semester-result-publication.pdf",
    views: "1.9k views",
  },
  {
    day: "28",
    month: "Jestha",
    title: "Annual Fest 2083 Dates Announced",
    href: "/assets/pdf/annual-fest-2083.pdf",
    views: "1.3k views",
  },
];

const PER_PAGE = 10;

export default function NoticesClient() {
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

  const filtered = notices.filter((n) => {
    const matchesCat = cat === "all" || n.cat === cat;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${n.title} ${n.text}`.toLowerCase().includes(q);
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
            <h1>Notices</h1>
            <p>
              Official announcements from the administration — admissions,
              exams, results and events.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide" style={{ maxWidth: 900 }}>
            <div className="section-head reveal">
              <span className="eyebrow">Announcements</span>
              <h2 className="section-title">Latest notices</h2>
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
                    {filtered.length} of {notices.length} shown
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
                        <span className="news-card__tag">{n.tag}</span>
                        <h3>
                          <a href={n.href}>{n.title}</a>
                        </h3>
                        <p>{n.text}</p>
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
              <h3>Get notices by email</h3>
              <p style={{ color: "var(--muted)", margin: ".5rem 0 1.2rem" }}>
                Subscribe to receive admission and exam updates directly.
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
                    Enter to Learn — Go Forth to Serve
                  </span>
                  <h2>A step towards your future</h2>
                  <p>
                    Applications for the 2083 intake are open across all three
                    programs. Take the first step today.
                  </p>
                </div>
                <div className="cta-band__actions">
                  <Link className="btn btn-gold btn-lg" href="/admission">
                    Apply Now{" "}
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
                    href="/programs"
                  >
                    Explore Programs
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
