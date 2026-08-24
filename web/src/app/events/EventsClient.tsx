"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Pagination from "../Pagination";
import "../pcm-pages.css";

type EventItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  seats: number;
  desc: string;
};

const events: EventItem[] = [
  { id: "e1", title: "Annual Fest 2083", type: "Festival", date: "2026-09-18", location: "PCM Campus, Nadipur", seats: 500, desc: "The flagship celebration of the PCM year — music, dance, food stalls, inter-batch competitions and performances by students." },
  { id: "e2", title: "Guest Lecture: Careers in Banking", type: "Seminar", date: "2026-08-22", location: "Seminar Hall", seats: 120, desc: "Industry leaders from the banking sector share real-world insight on building a career in finance and banking." },
  { id: "e3", title: "Coding Bootcamp for BCSIT", type: "Workshop", date: "2026-08-15", location: "IT Lab", seats: 60, desc: "A hands-on weekend bootcamp covering modern web development — open to all BCSIT students." },
  { id: "e4", title: "Annapurna Educational Tour", type: "Tour", date: "2026-09-05", location: "Annapurna Region", seats: 45, desc: "Our annual field trip into the Annapurna region — combining outdoor learning, teamwork and unforgettable views." },
  { id: "e5", title: "Inter-Batch Sports Tournament", type: "Sports", date: "2026-08-29", location: "Sports Ground", seats: 0, desc: "Friendly competition across batches in football, volleyball and basketball. Come cheer your batch!" },
  { id: "e6", title: "Career Day 2083", type: "Seminar", date: "2026-10-10", location: "Main Hall", seats: 200, desc: "Panel talks, resume reviews and one-on-one mentoring with professionals from banking, technology and consulting." },
  { id: "e7", title: "Inter-College Debate Championship", type: "Workshop", date: "2026-09-26", location: "Seminar Hall", seats: 150, desc: "Debaters from colleges across Pokhara battle it out on current affairs and campus topics." },
  { id: "e8", title: "Model United Nations (MUN) Workshop", type: "Workshop", date: "2026-10-03", location: "Seminar Hall", seats: 80, desc: "A beginner-friendly introduction to MUN procedure, committee rules and resolution drafting." },
  { id: "e9", title: "Bhirkot Community Service Trip", type: "Tour", date: "2026-10-17", location: "Bhirkot", seats: 40, desc: "A weekend of community service — teaching, cleaning drives and interaction with local students." },
  { id: "e10", title: "Sports Week 2083", type: "Sports", date: "2026-11-01", location: "Sports Ground", seats: 0, desc: "A full week of tournaments, prize distributions and house-level rivalry across every sport." },
  { id: "e11", title: "FinTech Guest Lecture", type: "Seminar", date: "2026-11-14", location: "Main Hall", seats: 180, desc: "Digital payments, neobanking and the future of finance — insights from industry practitioners." },
  { id: "e12", title: "Magh Mini Fest", type: "Festival", date: "2026-12-25", location: "PCM Campus, Nadipur", seats: 300, desc: "A mid-year celebration with cultural performances, stalls and inter-batch competitions to close the year." },
];

const TYPE_ICONS: Record<string, string> = {
  Workshop: "\u{1F6E0}\uFE0F",
  Seminar: "\u{1F3A4}",
  Festival: "\u{1F389}",
  Tour: "\u{1F3D4}\uFE0F",
  Sports: "\u{1F3C6}",
};

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_UPPER = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const UsersIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const CalIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
);
const ArrowRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);

const PER_PAGE = 10;

export default function EventsClient() {
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
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const totalPages = Math.max(1, Math.ceil(events.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = events.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div ref={rootRef} className="pcm-page">
      <main id="main">
        <section className="page-hero">
          <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2"/><path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45"/></svg>
          <div className="wrap-wide page-hero__inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <Link href="/news">News</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </nav>
            <h1>Events &amp; Workshops</h1>
            <p>Fests, seminars, workshops, tours and competitions - find your next moment at PCM.</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide">
            <div className="section-head-row">
              <div className="section-head reveal"><span className="eyebrow">Campus calendar</span><h2 className="section-title">What&apos;s happening at PCM</h2><p className="section-sub">Upcoming events across the college. Follow along, or join us on campus.</p></div>
              <Link className="btn btn-ghost reveal" href="/contact">Ask about an event {ArrowRight}</Link>
            </div>

            <div className="events-grid mt-7">
              {visible.map((e, i) => {
                const { m, d } = parts(e.date);
                return (
                  <article key={e.id} className="event-card reveal is-inview" style={{ transitionDelay: `${i * 60}ms` }}>
                    <div className="event-card__media">
                      <div className="event-card__bg--plain" style={{ height: "100%" }} />
                      <div className="event-card__cal"><b>{d}</b><span>{MONTHS_UPPER[m - 1]}</span></div>
                      <span className="event-card__type">{TYPE_ICONS[e.type] ?? "\u{1F4C5}"} {e.type}</span>
                    </div>
                    <div className="event-card__body">
                      <h3>{e.title}</h3>
                      <p className="event-card__desc">{e.desc}</p>
                      <div className="event-card__meta">
                        <span>{PinIcon}{e.location}</span>
                        {e.seats ? <span>{UsersIcon}{e.seats} seats</span> : null}
                        <span>{CalIcon}{fmtDate(e.date)}</span>
                      </div>
                    </div>
                    <div className="event-card__foot">
                      <Link className="link-arrow"
                        href={`/contact?subject=${encodeURIComponent(e.title.slice(0, 60))}`}>
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
