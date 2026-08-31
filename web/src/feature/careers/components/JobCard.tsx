import type { JobOpening } from "../types";

const ICONS = {
  management: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
    </svg>
  ),
  tech: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
} as const;

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

interface Props { item: JobOpening; }

export default function JobCard({ item }: Props) {
  return (
    <article className="career-job-card reveal">
      <div className="career-job-card__icon" style={{ background: item.iconBg, color: item.iconColor }}>
        {ICONS[item.iconType]}
      </div>
      <div className="career-job-card__meta">
        <span className="career-job-card__dept">{item.department}</span>
        <span className="career-job-card__type">{item.type}</span>
      </div>
      <h3 className="career-job-card__title">{item.title}</h3>
      <p className="career-job-card__desc">{item.description}</p>
      <p className="career-job-card__req">
        <strong>Requirements:</strong> {item.requirements}
      </p>
      <a
        className="career-link-arrow"
        href={`mailto:${item.applyEmail}?subject=${encodeURIComponent(item.applySubject)}`}
        aria-label={`Apply for ${item.title}`}
      >
        Apply now <ArrowRight />
      </a>
    </article>
  );
}
