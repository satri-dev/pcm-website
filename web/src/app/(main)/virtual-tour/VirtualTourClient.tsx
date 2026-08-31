"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { tourSpots, visitFeatures } from "@/feature/virtual-tour/data/virtual-tour";
import TourGrid from "@/feature/virtual-tour/components/TourGrid";
import "./virtual-tour.css";

/* ── SVG icons ── */
const ChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function VirtualTourClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Reveal-on-scroll */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-inview");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={rootRef} className="pcm-vt">
        {/* ── Page Hero ── */}
        <section className="page-hero">
          <svg
            className="page-hero__peaks"
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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
              <Link href="/">Home</Link>
              <ChevronRight />
              <span>Virtual Tour</span>
            </nav>
            <h1>Virtual Tour</h1>
            <p>
              Explore the PCM campus in Nadipur, Pokhara — from smart classrooms
              and IT labs to the library, seminar hall and sports ground.
            </p>
          </div>
        </section>

        {/* ── Experience PCM from anywhere ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="section-head center reveal">
              <span className="eyebrow">Campus highlights</span>
              <h2 className="section-title">Experience PCM from anywhere</h2>
              <p className="section-sub">
                Browse our key spaces and get a feel for life on campus before
                your first visit.
              </p>
            </div>
            <div className="reveal">
              <TourGrid spots={tourSpots} />
            </div>
          </div>
        </section>

        {/* ── See the campus in person ── */}
        <section className="section tone-sky">
          <div className="wrap-wide">
            <div className="split reverse reveal">
              {/* Left: image */}
              <div className="split__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/about-graduation.jpg"
                  alt="PCM graduation — visit us in person"
                  width={800}
                  height={600}
                />
              </div>

              {/* Right: content */}
              <div className="split__content">
                <span className="eyebrow">Plan your visit</span>
                <h2 className="section-title">See the campus in person</h2>
                <p>
                  Nothing beats seeing the campus for yourself. Walk through
                  our classrooms, meet the faculty and get a feel for student
                  life at PCM — all in a single visit.
                </p>
                <ul className="vt-checklist">
                  {visitFeatures.map((feature) => (
                    <li key={feature.id} className="vt-checklist__item">
                      <span className="vt-checklist__icon">
                        <CheckIcon />
                      </span>
                      <span className="vt-checklist__text">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="pill-row">
                  <span className="pill">Gyan Marg Nadipur</span>
                  <span className="pill">Sunday – Friday</span>
                  <span className="pill">Walk-in</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className="cta-section">
          <div className="wrap-wide">
            <div className="cta-band reveal">
              <div className="cta-band__inner">
                <div>
                  <span className="eyebrow" style={{ color: "var(--gold-400)" }}>
                    Enter to Learn — Go Forth to Serve
                  </span>
                  <h2>Ready for the real thing?</h2>
                  <p>
                    Come visit us at Gyan Marg, Nadipur, Pokhara — Sunday to
                    Friday. Or start your application today.
                  </p>
                </div>
                <div className="cta-band__actions">
                  <Link className="vt-btn vt-btn-gold vt-btn-lg" href="/admission">
                    Apply Now <ArrowRight />
                  </Link>
                  <Link className="vt-btn vt-btn-ghost-dark vt-btn-lg" href="/contact">
                    Plan a visit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
