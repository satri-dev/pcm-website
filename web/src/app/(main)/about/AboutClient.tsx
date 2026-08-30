"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./about.css";
import type { PageContent, PageContentSection } from "@/types/page-content";

const IMG = "/assets/img";

const FALLBACK: Record<string, PageContentSection> = {
  "who-we-are": {
    key: "who-we-are",
    eyebrow: "Who we are",
    title: "Quality management education, made affordable",
    paragraphs: [
      "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to make an impact on an organisation&apos;s strategic capability and competitive advantage.",
      "The PCM team firmly believes that quality management education is the need of the hour, as the world transforms into a common business arena. A business leader must understand the global rules to excel in local fields — and that spirit has guided us from humble beginnings to a college trusted by guardians, students and society alike.",
    ],
  },
  "why-pcm": {
    key: "why-pcm",
    eyebrow: "Why study at PCM?",
    title: "A balanced approach to management",
    paragraphs: [
      "The last two decades of change in information technology have brought unprecedented shifts to the business world. Markets are opening, competition is intensifying, and the horizon of management education is ever-evolving.",
      "Through it all, the time-tested values of management remain a guide. Our programs adopt a well-balanced approach — inculcating a strong theoretical concept of management alongside an intense realisation of its practical application in real life.",
    ],
  },
  values: {
    key: "values",
    eyebrow: "Vision, Mission &amp; Values",
    title: "What we stand for",
    paragraphs: [
      "To identify, develop and unveil the potential of future business leaders who define their own role and boundaries — and grasp the opportunities of a dynamic new world.",
      "A value-based organisation promoting discipline, sincerity, hard work and innovation as individual values, and respect, professionalism, fairness, transparency and team spirit as organisational values.",
      "To offer highly competitive, professionally oriented education — equipping students with advanced conceptual, analytical and quantitative techniques for decision-making.",
    ],
  },
  difference: { key: "difference", eyebrow: "The PCM difference", title: "What makes us different" },
  stats: { key: "stats", eyebrow: "By the numbers", title: "A legacy measured in outcomes" },
  achievers: {
    key: "achievers",
    eyebrow: "Voices of PCM",
    title: "What our achievers say",
    subtitle:
      "Graduates on the Dean&apos;s List reflect on their four-year journey — the mentorship, the friendships, and the confidence they carry forward.",
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

const achievers = [
  {
    photo: `${IMG}/hero-2.jpg`,
    name: "Amrit Adhikari",
    role: "Dean's List · 2075 BS",
    quote:
      "It gives me profound pleasure to have completed my BBA from PCM. The relationship between faculty and students is very cordial here, and the college gave me the opportunity to excel in my area of interest. The four years I spent here helped me grow professionally and personally.",
  },
  {
    photo: `${IMG}/about-2.jpg`,
    name: "Reena Gurung",
    role: "Dean's List · 2021 AD",
    quote:
      "The impression I had while first visiting PCM compelled me to be a part of it, and I don't regret that choice. The teaching method, extra-curricular activities, well-equipped facilities and practical knowledge boosted my confidence to face the real world.",
  },
  {
    photo: `${IMG}/hero-5.jpg`,
    name: "Rima Gurung",
    role: "Dean's List · 2021 AD",
    quote:
      "I found PCM as my best option — a place to learn, grow and find direction for my career. With an amazing team of faculty and a conducive learning environment, I was able to broaden my outlook and be prepared to face the real world. Enrolling at PCM was the best decision ever.",
  },
  {
    photo: `${IMG}/hero-6.jpg`,
    name: "Nischal Shrestha",
    role: "Dean's List · 2021 AD",
    quote:
      "The freedom to think and act on our own is the best thing about PCM — something you get in very few colleges. PCM emphasises overall development, giving priority to field visits, guest lectures and seminars that broaden horizons and challenge the way we think.",
  },
  {
    photo: `${IMG}/about-graduation.jpg`,
    name: "Binu Shrestha",
    role: "BBA · Dean's List 2021",
    quote:
      "I found PCM the best management college in the city and region. Its concern for students at an individual level is simply outstanding. During my PCM days I was inspired to start new ventures with social motives. I salute PCM and will ever remain thankful for its support.",
  },
  {
    photo: `${IMG}/about-1.jpg`,
    name: "Anusha Sharma",
    role: "BBA · 2016 Batch",
    quote:
      "Along with theoretical knowledge, PCM focuses on practical learning through field visits and tours. The PCM family is very supportive and always encourages academic excellence through presentations, group learning, seminars, guest lectures and internships.",
  },
];

const differences = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    title: "Qualified & experienced faculty",
    text: "A dedicated faculty pool with extensive experience across management and IT, bringing practical, cutting-edge learning into every classroom.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" /></svg>
    ),
    title: "Guest lectures & workshops",
    text: "Frequent guest lectures from business and IT industry leaders, plus hands-on workshops, are a regular part of the curriculum.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></svg>
    ),
    title: "Specialised, updated IT courses",
    text: "An IT curriculum integrated with management — focused on data analytics, cybersecurity, AI and machine learning.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
    ),
    title: "Vibrant extracurriculars",
    text: "Student clubs organise sports, entertainment, art and literature, idea pitching and more, all year round.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></svg>
    ),
    title: "Strong industry connections",
    text: "A wide network of industry partners for internships and placement support, opening doors after graduation.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    title: "Individual student care",
    text: "A caring culture that supports every student personally — the difference students notice most about PCM.",
  },
];

function Stat({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const dur = 1600;
      const step = (ts: number) => {
        if (!start) return;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(value * eased)}${suffix}`;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix]);

  return (
    <div className="stat">
      <b>
        <span ref={ref}>{`0${suffix}`}</span>
      </b>
      <span>{label}</span>
    </div>
  );
}

export default function AboutClient({ content }: { content: PageContent | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const spot = achievers[active];

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

  return (
    <div ref={rootRef} className="pcm-about">
      <main id="main">
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
              <span>About Us</span>
            </nav>
            <h1>{hero?.title ?? "About Pokhara College of Management"}</h1>
            <p>{hero?.subtitle ?? "Since 2002, a home for confident, creative and adaptive graduates in the heart of Pokhara."}</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap-wide split">
            <div className="reveal">
              <span className="eyebrow">{sec("who-we-are").eyebrow}</span>
              <h2 className="section-title">{sec("who-we-are").title}</h2>
              <p style={{ marginTop: "1rem" }}>{sec("who-we-are").paragraphs?.[0]}</p>
              <p>{sec("who-we-are").paragraphs?.[1]}</p>
              <div className="pill-row" style={{ marginTop: "1.4rem" }}>
                <span className="pill">Pokhara University</span>
                <span className="pill">Nadipur, Pokhara</span>
                <span className="pill">BBA · BBA-Finance · BCSIT</span>
              </div>
            </div>
            <div className="split__media reveal">
              <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="split-media-img" src={`${IMG}/about-1.jpg`} alt="PCM campus and students" loading="lazy" />
              </div>
              <div className="est-badge">
                <b>23+</b>
                <span>Years of Trust</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section tone-sky">
          <div className="wrap-wide split reverse">
            <div className="split__media reveal">
              <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="split-media-img" src={`${IMG}/about-2.jpg`} alt="The PCM campus in Nadipur" loading="lazy" />
              </div>
            </div>
            <div className="reveal">
              <span className="eyebrow">{sec("why-pcm").eyebrow}</span>
              <h2 className="section-title">{sec("why-pcm").title}</h2>
              <p style={{ marginTop: "1rem" }}>{sec("why-pcm").paragraphs?.[0]}</p>
              <p>{sec("why-pcm").paragraphs?.[1]}</p>
              <a className="btn btn-primary" href="/programs">
                See our programs{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="message">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">{sec("values").eyebrow}</span>
              <h2 className="section-title">{sec("values").title}</h2>
            </div>
            <div className="grid g-3 mt-7">
              <div className="feature reveal">
                <div className="feature__ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
                </div>
                <h3>Vision &amp; Mission</h3>
                <p>{sec("values").paragraphs?.[0]}</p>
              </div>
              <div className="feature reveal" style={{ transitionDelay: "90ms" }}>
                <div className="feature__ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9Z" /><path d="M2 9h20M12 3 8 9l4 12 4-12-4-6" /></svg>
                </div>
                <h3>Core Values</h3>
                <p>{sec("values").paragraphs?.[1]}</p>
              </div>
              <div className="feature reveal" style={{ transitionDelay: "180ms" }}>
                <div className="feature__ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></svg>
                </div>
                <h3>Objectives</h3>
                <p>{sec("values").paragraphs?.[2]}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section tone-sky" id="board">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">{sec("difference").eyebrow}</span>
              <h2 className="section-title">{sec("difference").title}</h2>
            </div>
            <ul className="icon-list grid g-2" style={{ gap: "1.6rem" }}>
              {differences.map((item, i) => (
                <li key={item.title} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="icon-list__ic">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="stats section">
          <div className="wrap-wide">
            <div className="section-head center reveal" style={{ maxWidth: 560, marginInline: "auto" }}>
              <span className="eyebrow on-dark">{sec("stats").eyebrow}</span>
              <h2 className="section-title" style={{ color: "#fff" }}>{sec("stats").title}</h2>
            </div>
            <div className="stats__grid mt-7">
              <Stat value={80} suffix="%" label="Success stories" />
              <Stat value={100} label="Dean's List Scholars" />
              <Stat value={1000} label="Graduates" />
              <Stat value={23} label="Years of Excellence" />
            </div>
          </div>
        </section>

        <section className="section tone-sky">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow">{sec("achievers").eyebrow}</span>
              <h2 className="section-title">{sec("achievers").title}</h2>
              <p className="section-sub">{sec("achievers").subtitle}</p>
            </div>
            <div className="achv reveal mt-7">
              <div className="achv__spot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="achv__photo" src={spot.photo} alt={`Photo of ${spot.name}`} loading="lazy" />
                <p className="achv__quote">{spot.quote}</p>
                <div className="achv__name">{spot.name}</div>
                <div className="achv__role">{spot.role}</div>
              </div>
              <div className="achv__list">
                {achievers.map((person, i) => (
                  <button
                    key={person.name}
                    type="button"
                    className={`achv__item${i === active ? " is-active" : ""}`}
                    onClick={() => setActive(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={person.photo} alt="" loading="lazy" />
                    <span>
                      <b>{person.name}</b>
                      <small>{person.role}</small>
                    </span>
                  </button>
                ))}
              </div>
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
                  <a className="btn btn-gold btn-lg" href="/admission">
                    Apply Now{" "}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                  <a className="btn btn-ghost on-dark btn-lg" href="/about">More Info</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
