"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "../about/legacy/legacy.css";
import "./clubs.css";

const IMG = "/assets/img";

const clubs = [
  {
    icon: "🌿",
    name: "Eco Club",
    description:
      "Green campus drives, waste segregation, tree plantation and sustainability awareness programs.",
    members: [
      { initials: "PS", name: "Prakash Sharma", role: "President", program: "BBA" },
      { initials: "AG", name: "Anisha Gurung", role: "Vice President", program: "BCSIT" },
    ],
  },
  {
    icon: "📊",
    name: "Finance Club",
    description:
      "Stock market simulations, investment workshops, financial literacy sessions and banking visits.",
    members: [
      { initials: "SB", name: "Sagar Bhattarai", role: "President", program: "BBA-Finance" },
      { initials: "NK", name: "Nisha Karki", role: "Treasurer", program: "BBA" },
    ],
  },
  {
    icon: "💻",
    name: "Coding Club",
    description:
      "Hackathons, competitive programming, web and app development bootcamps and tech talks.",
    members: [
      { initials: "BT", name: "Bishal Thapa", role: "President", program: "BCSIT" },
      { initials: "RM", name: "Rojina Maharjan", role: "Technical Lead", program: "BCSIT" },
    ],
  },
  {
    icon: "🗣️",
    name: "Debate Club",
    description:
      "Inter-college debates, elocution, public speaking workshops and model UN participation.",
    members: [
      { initials: "AL", name: "Aayusha Lamichhane", role: "President", program: "BBA" },
      { initials: "KR", name: "Kiran Rai", role: "Coordinator", program: "BBA-Finance" },
    ],
  },
  {
    icon: "🎵",
    name: "Music Club",
    description:
      "Band practice, open-mic nights, cultural performances and audio production workshops.",
    members: [
      { initials: "SK", name: "Samyak KC", role: "President", program: "BCSIT" },
      { initials: "MG", name: "Maya Ghale", role: "Events Lead", program: "BBA" },
    ],
  },
  {
    icon: "⚽",
    name: "Sports Club",
    description:
      "Intra-college tournaments in football, basketball, volleyball and athletics, plus futsal leagues.",
    members: [
      { initials: "DR", name: "Dinesh Rana", role: "President", program: "BBA-Finance" },
      { initials: "ST", name: "Sarita Tamang", role: "Captain", program: "BCSIT" },
    ],
  },
];

const whyJoinItems = [
  "Run real events — fests, seminars and competitions",
  "Build a portfolio of leadership and teamwork",
  "Connect with mentors, alumni and industry partners",
];

export default function ClubsClient() {
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
  }, []);

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
          <h1>Student Clubs</h1>
          <p>Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and build skills beyond the classroom.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide split reverse">
          <div className="split__media reveal">
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
              <img className="split-media-img" src={`${IMG}/about-games.jpg`} alt="PCM club activities and sports" loading="lazy" />
            </div>
            <div className="est-badge"><b>6+</b><span>Active Clubs</span></div>
          </div>
          <div className="reveal">
            <span className="eyebrow">Why join?</span>
            <h2 className="section-title">Leadership happens outside the lecture hall</h2>
            <p style={{ marginTop: "1rem" }}>
              Employers look for more than grades. Club leadership, event management and teamwork give PCM students the confidence and experience that make their résumés stand out.
            </p>
            <ul className="checklist" style={{ marginTop: "1.2rem" }}>
              {whyJoinItems.map((item) => (
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
            <span className="eyebrow">Six clubs, one community</span>
            <h2 className="section-title">Find your crew</h2>
            <p className="section-sub">Every club is run by students, for students — with a faculty mentor and a calendar of events each semester.</p>
          </div>
          <div className="grid g-3" style={{ marginTop: "2rem" }}>
            {clubs.map((club, i) => (
              <article key={club.name} className="club-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="club-card__head">
                  <span className="club-card__icon">{club.icon}</span>
                  <div>
                    <h3>{club.name}</h3>
                    <p>{club.description}</p>
                  </div>
                </div>
                <div className="club-card__members">
                  {club.members.map((m) => (
                    <div key={m.name} className="club-member">
                      <span className="club-member__photo club-member__photo--ph">{m.initials}</span>
                      <div className="club-member__info">
                        <b>{m.name}</b>
                        <span className="club-member__role">{m.role}</span>
                        <small className="club-member__prog">{m.program}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>A step towards your future</h2>
                <p>Applications for the 2083 intake are open across all three programs. Take the first step today.</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg " href="/admission">
                  Apply Now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
                <a className="btn btn-ghost on-dark btn-lg" href="/programs">Explore Programs</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
