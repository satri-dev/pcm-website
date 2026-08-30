"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "../about/legacy/legacy.css";
import "./clubs.css";
import type { PageContent, PageContentSection } from "@/types/page-content";

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

interface ClubsResponse {
  items: ClubApi[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

const whyJoinItems = [
  "Run real events — fests, seminars and competitions",
  "Build a portfolio of leadership and teamwork",
  "Connect with mentors, alumni and industry partners",
];

const FALLBACK: Record<string, PageContentSection> = {
  "why-join": {
    key: "why-join",
    eyebrow: "Why join?",
    title: "Leadership happens outside the lecture hall",
    paragraphs: [
      "Employers look for more than grades. Club leadership, event management and teamwork give PCM students the confidence and experience that make their résumés stand out.",
    ],
    checklist: whyJoinItems,
  },
  "clubs-list": {
    key: "clubs-list",
    eyebrow: "Clubs, one community",
    title: "Find your crew",
    subtitle:
      "Every club is run by students, for students — with a faculty mentor and a calendar of events each semester.",
  },
  cta: {
    key: "cta",
    eyebrow: "Enter to Learn — Go Forth to Serve",
    title: "A step towards your future",
    paragraphs: [
      "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    ],
  },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function ClubsClient({ content }: { content: PageContent | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [clubs, setClubs] = useState<ClubApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sec = (key: string): PageContentSection => {
    const found = content?.sections.find((s) => s.key === key);
    const merged: PageContentSection = { ...(FALLBACK[key] ?? {}), ...(found ?? {}) };
    for (const k of Object.keys(merged)) {
      if (merged[k as keyof PageContentSection] === undefined) {
        delete merged[k as keyof PageContentSection];
      }
    }
    return merged;
  };

  const hero = content?.hero;

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
  }, [clubs, loading]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/people/clubs?page=1&pageSize=50");
        if (!res.ok) throw new Error("Failed to load clubs");
        const data: ClubsResponse = await res.json();
        if (active) setClubs(data.items ?? []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load clubs");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

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
          <h1>{hero?.title ?? "Student Clubs"}</h1>
          <p>{hero?.subtitle ?? "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and build skills beyond the classroom."}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide split reverse">
          <div className="split__media reveal">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <img className="split-media-img" src={`${IMG}/about-games.jpg`} alt="PCM club activities and sports" loading="lazy" />
            </div>
            <div className="est-badge"><b>{loading ? "…" : `${clubCount}+`}</b><span>Active Clubs</span></div>
          </div>
          <div className="reveal">
            <span className="eyebrow">{sec("why-join").eyebrow}</span>
            <h2 className="section-title">{sec("why-join").title}</h2>
            <p style={{ marginTop: "1rem" }}>{sec("why-join").paragraphs?.[0]}</p>
            <ul className="checklist" style={{ marginTop: "1.2rem" }}>
              {(sec("why-join").checklist ?? whyJoinItems).map((item) => (
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
            <span className="eyebrow">{clubCount > 0 ? `${clubCount} ${clubCount === 1 ? "club" : "clubs"}, one community` : sec("clubs-list").eyebrow}</span>
            <h2 className="section-title">{sec("clubs-list").title}</h2>
            <p className="section-sub">{sec("clubs-list").subtitle}</p>
          </div>
          <div className="grid g-3" style={{ marginTop: "2rem" }}>
            {loading ? (
              <p style={{ padding: "2rem 0", color: "var(--muted)" }}>Loading clubs…</p>
            ) : error ? (
              <p style={{ padding: "2rem 0", color: "var(--muted)" }}>{error}</p>
            ) : clubs.length === 0 ? (
              <p style={{ padding: "2rem 0", color: "var(--muted)" }}>No clubs listed yet.</p>
            ) : (
              clubs.map((club, i) => (
                <article key={club.id} className="club-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="club-card__head">
                    <span className="club-card__icon">{club.icon}</span>
                    <div>
                      <h3>{club.name}</h3>
                      <p>{club.desc || club.tagline}</p>
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
                <span className="eyebrow on-dark">{sec("cta").eyebrow}</span>
                <h2>{sec("cta").title}</h2>
                <p>{sec("cta").paragraphs?.[0]}</p>
              </div>
              <div className="cta-band__actions">
                <Link className="btn btn-gold btn-lg " href="/admission">
                  Apply Now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <Link className="btn btn-ghost on-dark btn-lg" href="/programs">Explore Programs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}