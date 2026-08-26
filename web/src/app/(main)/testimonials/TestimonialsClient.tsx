"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "../about/legacy/legacy.css";
import "./testimonials.css";

const testimonials = [
  {
    quote: "The faculty here don't just teach — they mentor. The BBA program prepared me for a career in banking from day one.",
    name: "Prabhat Adhikari",
    role: "BBA, Batch 2080 — Global IME Bank",
  },
  {
    quote: "BCSIT at PCM gave me real projects and real confidence. I started as a junior developer and grew fast.",
    name: "Anisha Gurung",
    role: "BCSIT, Batch 2079 — Software Engineer",
  },
  {
    quote: "Small classes meant my voice was heard. My teachers knew my goals and pushed me toward them every single day.",
    name: "Srijana Karki",
    role: "BBA-Finance, Batch 2080 — MBA Scholar",
  },
  {
    quote: "The clubs and events at PCM made my college years unforgettable — and my CV far stronger.",
    name: "Roshan Thapa",
    role: "BBA, Batch 2079 — Marketing Executive",
  },
  {
    quote: "Scholarships made quality education affordable for my family. PCM opened doors I never thought possible.",
    name: "Bibek Poudel",
    role: "BCSIT, Batch 2081 — Scholarship Recipient",
  },
  {
    quote: "As a parent, I value how PCM communicates and how it cares. My daughter flourished here in every way.",
    name: "Meena Sharma",
    role: "Parent, Batch 2081",
  },
  {
    quote: "The BBA-Finance curriculum is practical — I walked into my first internship already knowing the tools.",
    name: "Sushmita Pradhan",
    role: "BBA-Finance, Batch 2078 — Audit Associate",
  },
  {
    quote: "Teachers at PCM never made a question feel small. That open-door culture changed how I learn.",
    name: "Karan Shrestha",
    role: "BCSIT, Batch 2080 — Data Analyst",
  },
  {
    quote: "The placement support team stayed with me from CV workshops to my first job offer. Truly grateful.",
    name: "Pooja Thapa",
    role: "BBA, Batch 2079 — HR Executive",
  },
  {
    quote: "PCM's labs gave us the confidence to build. Today I lead a small engineering team.",
    name: "Aashish Parajuli",
    role: "BCSIT, Batch 2078 — Software Team Lead",
  },
  {
    quote: "The management team runs an honest, caring college. We always knew exactly where our son stood.",
    name: "Ramesh Adhikari",
    role: "Parent, Batch 2080",
  },
  {
    quote: "From orientation to internship, every step felt organized and student-first.",
    name: "Nisha K.C.",
    role: "BBA, Batch 2081 — Student Ambassador",
  },
  {
    quote: "The finance society and mock trading sessions were the highlights of my degree.",
    name: "Deepak Bhattarai",
    role: "BBA-Finance, Batch 2079 — Credit Officer",
  },
  {
    quote: "I graduated with a portfolio, not just a certificate. That made all the difference in interviews.",
    name: "Sarita Magar",
    role: "BCSIT, Batch 2080 — UI Developer",
  },
  {
    quote: "Small college, big family. Teachers remember your name and your goals.",
    name: "Yubraj Kunwar",
    role: "BBA, Batch 2078 — Sales Manager",
  },
  {
    quote: "PCM connected me to a startup that became my first job. The alumni network is real.",
    name: "Bipana Shrestha",
    role: "BBA, Batch 2081 — Marketing Associate",
  },
  {
    quote: "As an employer, PCM graduates arrive prepared — organized, professional and eager to learn.",
    name: "Hari Nepal",
    role: "Hiring Partner, Pokhara",
  },
  {
    quote: "I never believed college could feel this personal. The scholarship team even helped me renew it.",
    name: "Laxmi Gurung",
    role: "BCSIT, Batch 2082 — Scholarship Recipient",
  },
];

const ITEMS_PER_PAGE = 16;

export default function TestimonialsClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTestimonials = testimonials.slice(startIndex, endIndex);

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
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div ref={rootRef} className="pcm-testimonials">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>{" "}
            <span>Testimonials</span>
          </nav>
          <h1>Student Testimonials</h1>
          <p>Real words from the PCM community — students, graduates and the families who trust us.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide">
          <div className="section-head reveal" style={{ textAlign: "center" }}>
            <span className="eyebrow">Voices of PCM</span>
            <h2 className="section-title">What our achievers say</h2>
            <p className="section-sub">A legacy measured in outcomes — hear it from the people who lived it.</p>
          </div>
          <div className="testi-grid mt-7">
            {currentTestimonials.map((testimonial, i) => (
              <figure key={i} className="card testi-card reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <svg className="testi-quote" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M10 7v6a5 5 0 0 1-5 5H4v-2h1a3 3 0 0 0 3-3H4V7h6Zm10 0v6a5 5 0 0 1-5 5h-1v-2h1a3 3 0 0 0 3-3h-4V7h6Z" />
                </svg>
                <blockquote>"{testimonial.quote}"</blockquote>
                <figcaption>
                  <b>{testimonial.name}</b>
                  <span>{testimonial.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Pagination */}
          <nav className="pagination" aria-label="Testimonial pages">
            <span className="pagination__info">
              Showing {startIndex + 1}-{Math.min(endIndex, testimonials.length)} of {testimonials.length}
            </span>
            <span className="pagination__list">
              <button
                type="button"
                className="pagination__btn"
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Previous page"
                aria-disabled={currentPage <= 1}
                disabled={currentPage <= 1}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="pagination__label">Prev</span>
              </button>

              {renderPageNumbers().map((page, idx) => (
                <span key={idx}>
                  {page === "..." ? (
                    <span className="pagination__ellipsis">…</span>
                  ) : (
                    <button
                      type="button"
                      className={`pagination__num ${currentPage === page ? "is-current" : ""}`}
                      onClick={() => goToPage(page as number)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )}
                </span>
              ))}

              <button
                type="button"
                className="pagination__btn"
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Next page"
                aria-disabled={currentPage >= totalPages}
                disabled={currentPage >= totalPages}
              >
                <span className="pagination__label">Next</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </span>
          </nav>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
                <h2>Write your own story</h2>
                <p>Join a community where students grow, succeed and belong. Your journey starts here.</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg" href="/admission">
                  Apply Now{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a className="btn btn-ghost on-dark btn-lg" href="/gallery">
                  See Campus Life
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
