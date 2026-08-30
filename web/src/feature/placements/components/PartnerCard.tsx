import type { RecruitmentPartner } from "../types";

interface Props {
  item: RecruitmentPartner;
}

/* ── Inline SVG icons ── */
const BankIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="1" y="22" width="22" height="2" />
    <rect x="3" y="10" width="4" height="10" />
    <rect x="10" y="10" width="4" height="10" />
    <rect x="17" y="10" width="4" height="10" />
    <path d="M12 2 L22 8 L2 8 Z" />
  </svg>
);

const TechIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const CorporateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const ICONS = {
  bank: BankIcon,
  tech: TechIcon,
  corporate: CorporateIcon,
} as const;

export default function PartnerCard({ item }: Props) {
  const Icon = ICONS[item.iconType];
  return (
    <article className="pl-partner-card">
      <div
        className="pl-partner-card__icon"
        style={{ background: item.iconBg, color: item.iconColor }}
      >
        <Icon />
      </div>
      <h3 className="pl-partner-card__title">{item.sector}</h3>
      <p className="pl-partner-card__companies">{item.companies}</p>
      <p className="pl-partner-card__desc">{item.description}</p>
    </article>
  );
}
