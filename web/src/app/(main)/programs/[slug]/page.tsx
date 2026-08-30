import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { programs, getProgramBySlug as getHardcodedProgram, getOtherPrograms } from "@/feature/Program/data/programs";
import { getProgramBySlug, getProgramsList } from "@/lib/data/programs";
import { getPageContent } from "@/lib/data/page-content";
import { CACHE_TAGS } from "@/lib/cache-tags";
import CurriculumTabs from "@/feature/Program/components/CurriculumTabs";
import "../programs.css";

// Generate static params from database programs
export async function generateStaticParams() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.programsList);
  
  const { items } = await getProgramsList({ pageSize: 100 });
  
  // Return both database slugs and hardcoded slugs for compatibility
  const dbSlugs = items.map((p) => ({ slug: p.slug }));
  const hardcodedSlugs = programs.map((p) => ({ slug: p.slug }));
  
  // Merge and deduplicate
  const allSlugs = [...dbSlugs, ...hardcodedSlugs];
  const uniqueSlugs = Array.from(new Set(allSlugs.map(s => s.slug))).map(slug => ({ slug }));
  
  return uniqueSlugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Try database first
  const dbProgram = await getProgramBySlug(slug);
  const pageContent = await getPageContent("programs");
  const programPage = (pageContent?.content as any)?.programPages?.[slug];
  
  // Fallback to hardcoded
  const hardcodedProgram = getHardcodedProgram(slug);
  
  const name = dbProgram?.name || hardcodedProgram?.fullName || "Program";
  const tagline = programPage?.hero?.tagline || hardcodedProgram?.tagline || "";
  
  return {
    title: `${name} | PCM Pokhara`,
    description: tagline,
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
  "use cache";
  cacheLife("content");
  
  const { slug } = await params;
  
  // Tag for cache invalidation
  cacheTag(CACHE_TAGS.program(slug));
  cacheTag(CACHE_TAGS.pageContent("programs"));
  
  // Get database program data (metadata)
  const dbProgram = await getProgramBySlug(slug);
  
  // Get CMS page content for this program
  const pageContent = await getPageContent("programs");
  const programPage = (pageContent?.content as any)?.programPages?.[slug] || {};
  
  // Get hardcoded program data (fallback for curriculum and structure)
  const hardcodedProgram = getHardcodedProgram(slug);
  
  // If neither exists, show 404
  if (!hardcodedProgram && !dbProgram) notFound();
  
  // Merge data: Database page content takes priority, then hardcoded as fallback
  const displayData = {
    // Basic info
    badge: dbProgram?.code || hardcodedProgram?.badge || slug.toUpperCase(),
    fullName: dbProgram?.name || hardcodedProgram?.fullName || "Program",
    image: dbProgram?.image || hardcodedProgram?.image || "/assets/img/program-bba.jpg",
    imageAlt: `${dbProgram?.name || hardcodedProgram?.fullName || 'Program'} - PCM Pokhara`,
    
    // Hero
    tagline: programPage.hero?.tagline || hardcodedProgram?.tagline || "",
    
    // Overview
    overviewTitle: programPage.overview?.title || hardcodedProgram?.overviewTitle || "Program Overview",
    overviewBody: programPage.overview?.body || hardcodedProgram?.overviewBody || [],
    
    // Concentrations
    concentrations: programPage.concentrations || hardcodedProgram?.concentrations || [],
    
    // Careers
    careers: programPage.careers || hardcodedProgram?.careers || [],
    
    // Admission
    admissionRequirements: programPage.admissionRequirements || hardcodedProgram?.admissionRequirements || [],
    
    // Quick Facts
    quickFacts: {
      level: programPage.quickFacts?.level || dbProgram?.level || hardcodedProgram?.quickFacts?.level || "Bachelor",
      duration: programPage.quickFacts?.duration || dbProgram?.duration || hardcodedProgram?.quickFacts?.duration || "4 Years",
      semesters: programPage.quickFacts?.semesters || hardcodedProgram?.quickFacts?.semesters || 8,
      creditHours: programPage.quickFacts?.creditHours || hardcodedProgram?.quickFacts?.creditHours || 0,
      eligibility: programPage.quickFacts?.eligibility || hardcodedProgram?.quickFacts?.eligibility || "10+2",
      affiliation: programPage.quickFacts?.affiliation || hardcodedProgram?.quickFacts?.affiliation || "Pokhara University",
      labels: programPage.quickFacts?.labels,
    },
    
    // Curriculum (from hardcoded for now)
    curriculum: programPage.curriculum || hardcodedProgram?.curriculum || [],
    totalCredits: programPage.totalCredits || hardcodedProgram?.totalCredits || "0 Credit Hours",
    curriculumSection: {
      eyebrow: programPage.curriculumSection?.eyebrow || "Curriculum",
      title: programPage.curriculumSection?.title || "Program structure & syllabus",
      description: programPage.curriculumSection?.description || "A carefully sequenced eight-semester journey from fundamentals to specialisation, capstone projects and a professional internship.",
    },
    
    // Coordinator
    coordinator: programPage.coordinator || hardcodedProgram?.coordinator || {
      name: "Program Coordinator",
      initials: "PC",
      image: "/assets/img/people/leader_hariadhikari.jpg",
      role: `${dbProgram?.code || slug.toUpperCase()} Coordinator`,
      quote: "We are committed to providing quality education.",
    },
    
    // Growth Section
    growthSection: programPage.growthSection,
    
    // Callout
    callout: programPage.callout,
    
    // CTA
    cta: {
      title: programPage.cta?.title,
      body: programPage.cta?.body,
      buttons: programPage.cta?.buttons,
    },
  };

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
            <span>{displayData.badge}</span>
          </nav>
          <h1>{displayData.fullName}</h1>
          <p>{displayData.tagline}</p>
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
                src={displayData.image}
                alt={displayData.imageAlt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 65vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Overview */}
            <span className="eyebrow">Program overview</span>
            <h2 className="section-title" style={{ marginTop: "0.5rem" }}>{displayData.overviewTitle}</h2>
            {displayData.overviewBody.map((para: string, i: number) => (
              <p key={i} style={{ marginTop: i === 0 ? "1rem" : "0.75rem", color: "var(--body-c)" }}>{para}</p>
            ))}

            {/* Growth Section (if exists in CMS) */}
            {displayData.growthSection?.title && displayData.growthSection?.items?.length > 0 && (
              <>
                <h3 className="program-section-h3">{displayData.growthSection.title}</h3>
                <ul className="program-icon-list program-grid-2">
                  {displayData.growthSection.items.map((item: any, idx: number) => (
                    <li key={idx} className="program-icon-item">
                      <div className="program-icon-ic"><StarIcon /></div>
                      <div>
                        <h4 style={{ fontSize: "1rem", color: "var(--navy)" }}>{item.title}</h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-c)", marginTop: "0.2rem" }}>{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Concentrations */}
            {displayData.concentrations.length > 0 && (
              <>
                <h3 className="program-section-h3">Areas of concentration</h3>
                <ul className="program-icon-list program-grid-2">
                  {displayData.concentrations.map((c: any) => (
                    <li key={c.title} className="program-icon-item">
                      <div className="program-icon-ic"><StarIcon /></div>
                      <div>
                        <h4 style={{ fontSize: "1rem", color: "var(--navy)" }}>{c.title}</h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-c)", marginTop: "0.2rem" }}>{c.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Careers */}
            {displayData.careers.length > 0 && (
              <>
                <h3 className="program-section-h3">Career opportunities</h3>
                <p style={{ color: "var(--muted-c)" }}>Graduates move into a wide range of professional roles, including:</p>
                <div className="pill-row" style={{ marginTop: "0.6rem" }}>
                  {displayData.careers.map((career: string) => (
                    <span key={career} className="pill">{career}</span>
                  ))}
                </div>
              </>
            )}

            {/* Callout (from CMS or default) */}
            <div className="callout" style={{ marginTop: "2rem" }}>
              <h4>{displayData.callout?.title || "Non-credit courses"}</h4>
              <p>{displayData.callout?.body || "Every semester includes non-credit courses that track current market demand for technology and skills — giving you an edge as you build toward your career path."}</p>
            </div>

            {/* Admission */}
            {displayData.admissionRequirements.length > 0 && (
              <>
                <h3 className="program-section-h3">Admission requirement</h3>
                <ul className="program-icon-list" style={{ gap: "0.9rem", marginTop: "0.4rem" }}>
                  {displayData.admissionRequirements.map((req: any) => (
                    <li key={req.title} className="program-icon-item">
                      <div className="program-icon-ic"><CheckIcon /></div>
                      <div>
                        <h4 style={{ fontSize: "1rem", color: "var(--navy)" }}>{req.title}</h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-c)", marginTop: "0.2rem" }}>{req.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Aside */}
          <aside>
            <div className="program-aside-card">
              <h3>{displayData.quickFacts.labels?.heading || "Quick facts"}</h3>
              <div className="program-facts-list">
                {(
                  [
                    { label: displayData.quickFacts.labels?.level || "Level",        value: displayData.quickFacts.level },
                    { label: displayData.quickFacts.labels?.duration || "Duration",     value: displayData.quickFacts.duration },
                    { label: displayData.quickFacts.labels?.semesters || "Semesters",    value: String(displayData.quickFacts.semesters) },
                    { label: displayData.quickFacts.labels?.creditHours || "Credit hours", value: String(displayData.quickFacts.creditHours) },
                    { label: displayData.quickFacts.labels?.eligibility || "Eligibility",  value: displayData.quickFacts.eligibility },
                    { label: displayData.quickFacts.labels?.affiliation || "Affiliation",  value: displayData.quickFacts.affiliation },
                  ] as const
                ).map((fact, i, arr) => (
                  <div key={fact.label} className={`program-fact-row${i === arr.length - 1 ? " last" : ""}`}>
                    <span>{fact.label}</span>
                    <b>{fact.value}</b>
                  </div>
                ))}
              </div>
              <a 
                className="btn btn-primary program-aside-btn" 
                href={displayData.cta?.buttons?.primary?.url || "/admission"}
              >
                {displayData.cta?.buttons?.primary?.text || `Apply for ${displayData.badge}`} <ArrowRight />
              </a>
              <a 
                className="btn btn-ghost program-aside-btn" 
                href={displayData.cta?.buttons?.secondary?.url || "/contact"} 
                style={{ marginTop: "0.6rem" }}
              >
                {displayData.cta?.buttons?.secondary?.text || "Ask a question"}
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
      {displayData.curriculum.length > 0 && (
        <section className="section tone-sky">
          <div className="wrap-wide">
            <div className="section-head">
              <span className="eyebrow">{displayData.curriculumSection.eyebrow}</span>
              <h2 className="section-title">{displayData.curriculumSection.title}</h2>
              <p className="section-sub">{displayData.curriculumSection.description}</p>
            </div>
            <div style={{ marginTop: "2.2rem" }}>
              <CurriculumTabs semesters={displayData.curriculum} totalCredits={displayData.totalCredits} />
            </div>
          </div>
        </section>
      )}

      {/* ── Coordinator ── */}
      {displayData.coordinator.name && (
        <section className="section">
          <div className="wrap-wide">
            <div className="section-head center">
              <span className="eyebrow">Your guide at PCM</span>
              <h2 className="section-title">Meet your program coordinator</h2>
            </div>
            <article className="leader-card" style={{ marginTop: "2.5rem" }}>
              <div className="leader-card__media">
                <Image
                  src={displayData.coordinator.image}
                  alt={displayData.coordinator.name}
                  fill
                  sizes="360px"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
                <span className="leader-card__chip">{displayData.coordinator.initials}</span>
              </div>
              <div className="leader-card__body">
                <span className="eyebrow">{displayData.coordinator.role}</span>
                <h3 className="leader-card__name">{displayData.coordinator.name}</h3>
                <div className="leader-card__role">{displayData.coordinator.role}</div>
                <p className="leader-card__text">{displayData.coordinator.quote}</p>
                <Link className="link-arrow" style={{ marginTop: "1.1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }} href="/about/message">
                  Read my full message <ArrowRight />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── CTA Band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>{displayData.cta?.title || `Ready to apply for ${displayData.badge}?`}</h2>
                <p>{displayData.cta?.body || "Apply online in minutes, or reach out and we'll guide you through every step."}</p>
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
