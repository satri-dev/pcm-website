"use client";

const ChevronLeft = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;
  const go = (p: number) => {
    onChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination__info">Page {page} of {total}</span>
      <span className="pagination__list">
        <button type="button" className="pagination__btn" aria-label="Previous page"
          aria-disabled={page <= 1} disabled={page <= 1}
          onClick={() => go(page - 1)}>
          {ChevronLeft}<span className="pagination__label">Prev</span>
        </button>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button"
            className={`pagination__num${n === page ? " is-current" : ""}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => go(n)}>
            {n}
          </button>
        ))}
        <button type="button" className="pagination__btn" aria-label="Next page"
          aria-disabled={page >= total} disabled={page >= total}
          onClick={() => go(page + 1)}>
          <span className="pagination__label">Next</span>{ChevronRight}
        </button>
      </span>
    </nav>
  );
}
