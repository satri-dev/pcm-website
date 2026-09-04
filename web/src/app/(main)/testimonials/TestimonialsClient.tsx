"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "../about/legacy/legacy.css";
import "./testimonials.css";
import TestimonialFormModal from "./TestimonialFormModal";
import { Testimonial } from "@/types/testimonial";
import { TestimonialPageSettings } from "@/types/testimonial-page-settings";
import { Plus } from "lucide-react";

const ITEMS_PER_PAGE = 16;

interface TestimonialsClientProps {
  testimonials: Testimonial[];
  settings: TestimonialPageSettings;
}

function roleLine(t: Testimonial): string {
  return [t.position, t.program, t.batch ? `Batch ${t.batch}` : ""]
    .filter(Boolean)
    .join(", ");
}

export default function TestimonialsClient({
  testimonials,
  settings,
}: TestimonialsClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

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
  }, [currentPage, testimonials.length]);

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
            <span>{settings.heroEyebrow}</span>
          </nav>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap-wide">
          <div className="section-head-row reveal">
            <div className="section-head" style={{ textAlign: "left" }}>
              <span className="eyebrow">{settings.headEyebrow}</span>
              <h2 className="section-title">{settings.headTitle}</h2>
              <p className="section-sub">{settings.headSubtitle}</p>
            </div>
            {settings.addEnabled && (
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="btn btn-gold"
              >
                <Plus size={18} />
                {settings.addButtonLabel}
              </button>
            )}
          </div>

          {currentTestimonials.length === 0 ? (
            <p className="mt-7 text-center text-slate-500">
              {settings.emptyText}
            </p>
          ) : (
            <div className="testi-grid mt-7">
              {currentTestimonials.map((testimonial, i) => (
                <figure key={testimonial.id} className="card testi-card reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                  <svg className="testi-quote" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M10 7v6a5 5 0 0 1-5 5H4v-2h1a3 3 0 0 0 3-3H4V7h6Zm10 0v6a5 5 0 0 1-5 5h-1v-2h1a3 3 0 0 0 3-3h-4V7h6Z" />
                  </svg>
                  <blockquote
                    dangerouslySetInnerHTML={{ __html: testimonial.content }}
                  />
                  <figcaption>
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="testi-avatar"
                      />
                    ) : null}
                    <b>{testimonial.name}</b>
                    <span>{roleLine(testimonial)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Pagination */}
          {testimonials.length > ITEMS_PER_PAGE && (
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
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">{settings.ctaEyebrow}</span>
                <h2>{settings.ctaTitle}</h2>
                <p>{settings.ctaText}</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg" href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel}{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a className="btn btn-ghost on-dark btn-lg" href={settings.ctaSecondaryHref}>
                  {settings.ctaSecondaryLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        copy={settings.form}
      />
    </div>
  );
}
