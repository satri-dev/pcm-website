import type { WorkBenefit } from "../types";

const ICONS = {
  culture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  growth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
    </svg>
  ),
  impact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
} as const;

interface Props { item: WorkBenefit; }

export default function BenefitCard({ item }: Props) {
  return (
    <div className="career-benefit-card reveal">
      <div className="career-benefit-card__icon" style={{ background: item.iconBg, color: item.iconColor }}>
        {ICONS[item.iconType]}
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
}
