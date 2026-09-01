import type { Survey } from "../types";

interface Props {
  survey: Survey;
  onOpen: (s: Survey) => void;
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);

function fmtDeadline(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SurveyCard({ survey, onOpen }: Props) {
  const deadline = fmtDeadline(survey.deadline);
  return (
    <article
      className="sv-card"
      onClick={() => onOpen(survey)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(survey); } }}
      role="button"
      tabIndex={0}
      aria-label={`Open survey: ${survey.title}`}
    >
      <div className="sv-card__header">
        <span className="sv-card__icon" aria-hidden="true">{survey.icon}</span>
        <span className="sv-card__cat">{survey.category}</span>
      </div>
      <h3 className="sv-card__title">{survey.title}</h3>
      <p className="sv-card__desc">{survey.description}</p>
      <div className="sv-card__meta">
        <span className="sv-card__meta-item">
          <ClockIcon />
          ~{survey.estimatedMinutes} min
        </span>
        <span className="sv-card__meta-item">
          {survey.questions.length} questions
        </span>
        {deadline && (
          <span className="sv-card__meta-item sv-card__deadline">
            Ends {deadline}
          </span>
        )}
      </div>
      <div className="sv-card__foot">
        <span className="sv-card__cta">Take survey <ArrowIcon /></span>
      </div>
    </article>
  );
}
