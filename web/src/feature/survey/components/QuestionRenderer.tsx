"use client";

import type { SurveyQuestion, SurveyAnswers } from "../types";

interface Props {
  question: SurveyQuestion;
  index: number;
  answers: SurveyAnswers;
  onAnswer: (id: string, value: string | string[] | number) => void;
  onToggle: (id: string, option: string) => void;
}

const StarFill = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`sv-star-svg${filled ? " sv-star-svg--filled" : ""}`}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function QuestionRenderer({ question, index, answers, onAnswer, onToggle }: Props) {
  const val = answers[question.id];

  return (
    <div className="sv-question">
      <div className="sv-question__badge">Q{index + 1}</div>
      <label className="sv-question__label" htmlFor={`q-${question.id}`}>
        {question.label}
        {question.required && <span className="sv-req" aria-hidden="true"> *</span>}
      </label>
      {question.hint && <p className="sv-question__hint">{question.hint}</p>}

      {/* TEXT */}
      {question.type === "text" && (
        <input
          id={`q-${question.id}`}
          type="text"
          className="sv-input"
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          required={question.required}
        />
      )}

      {/* TEXTAREA */}
      {question.type === "textarea" && (
        <textarea
          id={`q-${question.id}`}
          className="sv-input sv-textarea"
          rows={4}
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          required={question.required}
        />
      )}

      {/* SELECT */}
      {question.type === "select" && (
        <select
          id={`q-${question.id}`}
          className="sv-input sv-select"
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          required={question.required}
        >
          <option value="">Select an option…</option>
          {question.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {/* RADIO */}
      {question.type === "radio" && (
        <div className="sv-options" role="radiogroup" aria-labelledby={`q-${question.id}`}>
          {question.options?.map(opt => (
            <label key={opt} className={`sv-option${val === opt ? " sv-option--selected" : ""}`}>
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                checked={val === opt}
                onChange={() => onAnswer(question.id, opt)}
                required={question.required}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {/* CHECKBOX */}
      {question.type === "checkbox" && (
        <div className="sv-options sv-options--check" role="group" aria-labelledby={`q-${question.id}`}>
          {question.options?.map(opt => {
            const checked = ((val as string[]) ?? []).includes(opt);
            return (
              <label key={opt} className={`sv-option sv-option--check${checked ? " sv-option--selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(question.id, opt)}
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {/* RATING */}
      {question.type === "rating" && (
        <div className="sv-stars" role="group" aria-label={question.label}>
          {Array.from({ length: question.maxRating ?? 5 }, (_, i) => i + 1).map(star => (
            <button
              key={star}
              type="button"
              className="sv-star"
              onClick={() => onAnswer(question.id, star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              aria-pressed={(val as number) >= star}
            >
              <StarFill filled={(val as number) >= star} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
