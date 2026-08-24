import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { programs } from "@/feature/Program/data/programs";

export const metadata: Metadata = {
  title: "Programs | BBA, BBA-Finance & BCSIT at PCM Pokhara",
  description:
    "Explore BBA, BBA-Finance and BCSIT degrees at Pokhara College of Management, affiliated to Pokhara University.",
};

const ChevronRight = () => (
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

export default function ProgramsPage() {
  return (
    <main id="main">
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg
          className="page-hero__peaks"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#1C4E8A" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#143560" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span>Programs</span>
          </nav>
          <h1>Academic Programs</h1>
          <p>
            Three Pokhara University bachelor&apos;s degrees, each built to turn
            four years of study into a career you&apos;re proud of.
          </p>
        </div>
      </section>

      {/* ── Program Cards ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head">
            <span className="eyebrow">Choose your path</span>
            <h2 className="section-title">Undergraduate degrees at PCM</h2>
            <p className="section-sub">
              Every PCM program blends conceptual depth with real-world practice,
              non-credit skill courses and internship experience.
            </p>
          </div>

          <div className="grid g-3" style={{ marginTop: "2.5rem" }}>
            {programs.map((prog, i) => (
              <article
                key={prog.slug}
                className="card prog-card"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="prog-card__media">
                  <span className="prog-card__badge">{prog.badge}</span>
                  <Image
                    src={prog.image}
                    alt={prog.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
                <div className="prog-card__body">
                  <h3>
                    <Link href={`/programs/${prog.slug}`}>{prog.fullName}</Link>
                  </h3>
                  <p>{prog.tagline}</p>
                  <div className="prog-meta">
                    <div>
                      <b>{prog.quickFacts.duration}</b>
                      <span>Duration</span>
                    </div>
                    <div>
                      <b>{prog.quickFacts.creditHours} Cr</b>
                      <span>Credit Hours</span>
                    </div>
                    <div>
                      <b>48</b>
                      <span>Seats</span>
                    </div>
                  </div>
                  <Link className="link-arrow" href={`/programs/${prog.slug}`}>
                    Explore {prog.badge} <ChevronRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compare Table ── */}
      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head center">
            <span className="eyebrow">At a glance</span>
            <h2 className="section-title">Compare the programs</h2>
          </div>

          <div style={{ overflowX: "auto", marginTop: "2rem" }}>
            <table className="ctable" style={{ minWidth: "640px" }}>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Focus</th>
                  <th>Duration</th>
                  <th>Credits</th>
                  <th>Ideal for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BBA</td>
                  <td style={{ fontFamily: "var(--ff-body)", color: "var(--body)", textAlign: "left" }}>
                    General management &amp; leadership
                  </td>
                  <td>4 Years</td>
                  <td>123</td>
                  <td style={{ fontFamily: "var(--ff-body)", color: "var(--body)", textAlign: "left" }}>
                    Future managers &amp; entrepreneurs
                  </td>
                </tr>
                <tr>
                  <td>BBA-Finance</td>
                  <td style={{ fontFamily: "var(--ff-body)", color: "var(--body)", textAlign: "left" }}>
                    Finance, investment &amp; banking
                  </td>
                  <td>4 Years</td>
                  <td>120</td>
                  <td style={{ fontFamily: "var(--ff-body)", color: "var(--body)", textAlign: "left" }}>
                    Analysts &amp; finance professionals
                  </td>
                </tr>
                <tr>
                  <td>BCSIT</td>
                  <td style={{ fontFamily: "var(--ff-body)", color: "var(--body)", textAlign: "left" }}>
                    IT + business management
                  </td>
                  <td>4 Years</td>
                  <td>127</td>
                  <td style={{ fontFamily: "var(--ff-body)", color: "var(--body)", textAlign: "left" }}>
                    Developers, data &amp; IT specialists
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="callout" style={{ marginTop: "1.6rem" }}>
            <h4>Not sure which fits you?</h4>
            <p>
              Our admissions team helps you match your interests and goals to the
              right program. Call (061) 544761 or visit the campus for a friendly,
              no-pressure chat.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="cta-band">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>Ready to choose your program?</h2>
                <p>Apply online in minutes, or reach out and we&apos;ll guide you through every step.</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg" href="/admission">
                  Apply Now <ChevronRight />
                </a>
                <a className="btn btn-ghost on-dark btn-lg" href="/about">
                  More Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
