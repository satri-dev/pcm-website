import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { programs, getProgramBySlug, getOtherPrograms } from "@/feature/Program/data/programs";
import CurriculumTabs from "@/feature/Program/components/CurriculumTabs";
import "../programs.css";

export async function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: `${program.fullName} | PCM Pokhara`,
    description: program.tagline,
  };
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const others = getOtherPrograms(slug);

  return (
    <div className="pcm-programs">
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            <Link href="/programs">Programs</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            <span>{program.badge}</span>
          </nav>
          <h1>{program.fullName}</h1>
          <p>{program.tagline}</p>
        </div>
      </section>

      {/* ── Content + Aside ── */}
      <section className="section">
        <div className="wrap-wide program-with-aside">
          {/* Left */}
          <div>
            {/* Hero image */}
            <div className="program-hero-img-wrap">
              <Image
                src={program.image}
                alt={program.imageAlt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 65vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Overview */}
            <span className="eyebrow">Program overview</span>
            <h2 className="section-title" style={{ marginTop: "0.5rem" }}>{program.overviewTitle}</h2>
            {program.overviewBody.map((para, i) => (
              <p key={i} style={{ marginTop: i === 0 ? "1rem" : "0.75rem", color: "var(--body-c)" }}>{para}</p>
            ))}

            {/* Concentrations */}
            <h3 className="program-section-h3">Areas of concentration</h3>
            <ul className="program-icon-list program-grid-2">
              {program.concentrations.map((c) => (
                <li key={c.title} className="program-icon-item">
                  <div className="program-icon-ic"><StarIcon /></div>
                  <div>
                    <h4 style={{ fontSize: "1rem", color: "var(--navy)" }}>{c.title}</h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted-c)", marginTop: "0.2rem" }}>{c.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Careers */}
            <h3 className="program-section-h3">Career opportunities</h3>
            <p style={{ color: "var(--muted-c)" }}>Graduates move into a wide range of professional roles, including:</p>
            <div className="pill-row" style={{ marginTop: "0.6rem" }}>
              {program.careers.map((career) => (
                <span key={career} className="pill">{career}</span>
              ))}
            </div>

            {/* Callout */}
            <div className="callout" style={{ marginTop: "2rem" }}>
              <h4>Non-credit courses</h4>
              <p>Every semester includes non-credit courses that track current market demand for technology and skills — giving you an edge as you build toward your career path.</p>
            </div>

            {/* Admission */}
            <h3 className="program-section-h3">Admission requirement</h3>
            <ul className="program-icon-list" style={{ gap: "0.9rem", marginTop: "0.4rem" }}>
              {program.admissionRequirements.map((req) => (
                <li key={req.title} className="program-icon-item">
                  <div className="program-icon-ic"><CheckIcon /></div>
                  <div>
                    <h4 style={{ fontSize: "1rem", color: "var(--navy)" }}>{req.title}</h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted-c)", marginTop: "0.2rem" }}>{req.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Aside */}
          <aside>
            <div className="program-aside-card">
              <h3>Quick facts</h3>
              <div className="program-facts-list">
                {(
                  [
                    { label: "Level",        value: program.quickFacts.level },
                    { label: "Duration",     value: program.quickFacts.duration },
                    { label: "Semesters",    value: String(program.quickFacts.semesters) },
                    { label: "Credit hours", value: String(program.quickFacts.creditHours) },
                    { label: "Eligibility",  value: program.quickFacts.eligibility },
                    { label: "Affiliation",  value: program.quickFacts.affiliation },
                  ] as const
                ).map((fact, i, arr) => (
                  <div key={fact.label} className={`program-fact-row${i === arr.length - 1 ? " last" : ""}`}>
                    <span>{fact.label}</span>
                    <b>{fact.value}</b>
                  </div>
                ))}
              </div>
              <a className="btn btn-primary program-aside-btn" href="/admission">
                Apply for {program.badge} <ArrowRight />
              </a>
              <a className="btn btn-ghost program-aside-btn" href="/contact" style={{ marginTop: "0.6rem" }}>
                Ask a question
              </a>
            </div>

            <div className="program-aside-card" style={{ marginTop: "1.4rem" }}>
              <h3>Other programs</h3>
              <div className="program-aside-nav">
                {others.map((other) => (
                  <Link key={other.slug} href={`/programs/${other.slug}`}>
                    {other.fullName} <ChevronRight />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="section tone-sky">
        <div className="wrap-wide">
          <div className="section-head">
            <span className="eyebrow">Curriculum</span>
            <h2 className="section-title">Program structure &amp; syllabus</h2>
            <p className="section-sub">A carefully sequenced eight-semester journey from fundamentals to specialisation, capstone projects and a professional internship.</p>
          </div>
          <div style={{ marginTop: "2.2rem" }}>
            <CurriculumTabs semesters={program.curriculum} totalCredits={program.totalCredits} />
          </div>
        </div>
      </section>

      {/* ── Coordinator ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center">
            <span className="eyebrow">Your guide at PCM</span>
            <h2 className="section-title">Meet your program coordinator</h2>
          </div>
          <article className="leader-card" style={{ marginTop: "2.5rem" }}>
            <div className="leader-card__media">
              <Image
                src={program.coordinator.image}
                alt={program.coordinator.name}
                fill
                sizes="360px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
              <span className="leader-card__chip">{program.coordinator.initials}</span>
            </div>
            <div className="leader-card__body">
              <span className="eyebrow">{program.coordinator.role}</span>
              <h3 className="leader-card__name">{program.coordinator.name}</h3>
              <div className="leader-card__role">{program.coordinator.role}</div>
              <p className="leader-card__text">{program.coordinator.quote}</p>
              <Link className="link-arrow" style={{ marginTop: "1.1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }} href="/about/message">
                Read my full message <ArrowRight />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>Ready to apply for {program.badge}?</h2>
                <p>Apply online in minutes, or reach out and we&apos;ll guide you through every step.</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg" href="/admission">Apply Now <ArrowRight /></a>
                <Link className="btn btn-ghost on-dark btn-lg" href="/programs">All Programs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
