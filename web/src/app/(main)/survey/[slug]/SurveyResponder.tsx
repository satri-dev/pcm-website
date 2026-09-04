"use client";

import { useMemo, useState } from "react";
import type { Survey, SurveyQuestion, QuestionCondition } from "@/types/surveys";
import type { SurveyPageSettings } from "@/types/survey-page-settings";

type Answers = Record<string, string | string[] | number | number[]>;

/* ── SVG icons ── */
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="36" height="36"><path d="M20 6 9 17l-5-5" /></svg>
);

function flatten(questions: SurveyQuestion[]): SurveyQuestion[] {
  const out: SurveyQuestion[] = [];
  for (const q of questions || []) {
    out.push(q);
    if (q.children && q.children.length) out.push(...flatten(q.children));
  }
  return out;
}

function matchesCondition(condition: QuestionCondition, answers: Answers): boolean {
  const raw = answers[condition.parentId];
  const values = Array.isArray(raw) ? raw.map(String) : raw === undefined || raw === null ? [] : [String(raw)];
  const wanted = condition.value;

  switch (condition.operator) {
    case "equals": {
      const target = wanted === undefined ? "" : String(wanted);
      return values.some((v) => v === target);
    }
    case "notEquals": {
      const target = wanted === undefined ? "" : String(wanted);
      return values.length > 0 && !values.some((v) => v === target);
    }
    case "contains":
      return values.some((v) => v.toLowerCase().includes(String(wanted ?? "").toLowerCase()));
    case "notContains":
      return values.length > 0 && !values.some((v) => v.toLowerCase().includes(String(wanted ?? "").toLowerCase()));
    case "in":
      return Array.isArray(wanted) && values.some((v) => wanted.includes(v));
    case "notIn":
      return values.length > 0 && Array.isArray(wanted) && !values.some((v) => wanted.includes(v));
    case "empty":
      return values.length === 0 || values.every((v) => !v.trim());
    case "notEmpty":
      return values.length > 0 && values.some((v) => v.trim().length > 0);
    default:
      return true;
  }
}

interface Ctx {
  answers: Answers;
  visibilityMap: Map<string, boolean>;
}

function isVisible(q: SurveyQuestion, ctx: Ctx): boolean {
  return ctx.visibilityMap.get(q.id) ?? true;
}

export default function SurveyResponder({
  survey,
  settings,
}: {
  survey: Survey;
  settings: SurveyPageSettings;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [respondent, setRespondent] = useState("");
  const [status, setStatus] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const flat = useMemo(() => flatten(survey.questions), [survey.questions]);

  const visibilityMap = useMemo(() => {
    const map = new Map<string, boolean>();
    const ctx: Ctx = { answers, visibilityMap: map };
    for (const q of flat) {
      if (!q.visibility) {
        map.set(q.id, true);
        continue;
      }
      const vis = q.visibility;
      const parentVisible = map.has(vis.parentId)
        ? map.get(vis.parentId)
        : flat.some((f) => f.id === vis.parentId);
      map.set(q.id, parentVisible === false ? false : matchesCondition(vis, answers));
    }
    return map;
  }, [flat, answers]);

  const setAnswer = (id: string, value: Answers[string]) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const toggleCheckbox = (id: string, option: string) =>
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [id]: next };
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate visible required questions
    for (const q of flat) {
      if (!isVisible(q, { answers, visibilityMap })) continue;
      if (q.type === "group" || q.type === "section" || q.type === "description") continue;
      if (!q.required) continue;
      const value = answers[q.id];
      const empty = value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (empty) {
        setServerError(`Please answer: "${q.label}"`);
        const el = document.getElementById(`q-${q.id}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveySlug: survey.slug, surveyId: survey.id, respondent, answers }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Could not submit your response. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {status === "success" ? (
        <div className="sv-success" role="status" aria-live="polite">
          <div className="sv-success__icon"><CheckIcon /></div>
          <h3>{settings.thankYouTitle}</h3>
          <p>{settings.thankYouText || `${settings.backToListLabel} to continue exploring surveys.`}</p>
          <a className="sv-btn sv-btn-outline" href="/survey">{settings.backToListLabel}</a>
        </div>
      ) : (
        <>
          <a className="sv-back-btn" href="/survey"><ChevronLeft /> {settings.backToListLabel}</a>

          <div className="sv-form-header">
            <span className="eyebrow">{settings.detailEyebrow}</span>
            <h2>{survey.title}</h2>
            <div
              className="prose prose-sm max-w-none sv-form-description"
              dangerouslySetInnerHTML={{ __html: survey.excerpt || survey.content }}
            />
          </div>

          {serverError && (
            <div className="sv-server-error" role="alert">{serverError}</div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="sv-respondent-field">
              <label htmlFor="sv-respondent">
                {settings.respondentLabel}{" "}
                <span className="sv-hint">{settings.respondentHint}</span>
              </label>
              <input
                id="sv-respondent"
                type="text"
                className="sv-input"
                placeholder={settings.respondentHint}
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                maxLength={80}
                autoComplete="name"
              />
            </div>

            {(() => {
              let visibleIndex = 0;
              return survey.questions.map((q) => {
                const isNumbered = isNumberedType(q.type);
                if (isNumbered) visibleIndex += 1;
                return (
                  <Renderer
                    key={q.id}
                    q={q}
                    index={isNumbered ? visibleIndex : -1}
                    answers={answers}
                    onAnswer={setAnswer}
                    onToggle={toggleCheckbox}
                    visibilityMap={visibilityMap}
                  />
                );
              });
            })()}

            <button
              type="submit"
              className="sv-btn sv-btn-primary sv-btn-lg"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Submitting…" : (<>{settings.submitLabel} <SendIcon /></>)}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

// ── Recursive field renderer ──
function fieldValue(q: SurveyQuestion, answers: Answers) {
  return answers[q.id];
}

const NUMBERED_TYPES = new Set<SurveyQuestion["type"]>([
  "text", "textarea", "number", "email", "phone", "url",
  "radio", "checkbox", "select", "rating", "date", "time",
]);

function isNumberedType(t: SurveyQuestion["type"]): boolean {
  return NUMBERED_TYPES.has(t);
}

function Renderer({
  q,
  index,
  answers,
  onAnswer,
  onToggle,
  visibilityMap,
  depth = 0,
}: {
  q: SurveyQuestion;
  index: number;
  answers: Answers;
  onAnswer: (id: string, value: Answers[string]) => void;
  onToggle: (id: string, option: string) => void;
  visibilityMap: Map<string, boolean>;
  depth?: number;
}) {
  const ctx: Ctx = { answers, visibilityMap };
  if (!isVisible(q, ctx)) return null;

  const val = fieldValue(q, answers);
  const req = !!q.required;
  const inputId = `q-${q.id}`;

  if (q.type === "section" || q.type === "description") {
    return (
      <div className="sv-question sv-question--note" style={{ marginLeft: depth * 20 }}>
        <h3 style={{ fontSize: "1.05rem" }}>{q.label}</h3>
        {q.hint && <p className="sv-question__hint">{q.hint}</p>}
      </div>
    );
  }

  if (q.type === "group") {
    return (
      <div className="sv-group" style={{ marginLeft: depth * 20 }}>
        {q.label && (
          <div className="sv-group__head">
            <h3>{q.label}</h3>
            {q.hint && <p className="sv-question__hint">{q.hint}</p>}
          </div>
        )}
        {(q.children || []).length > 0 && (() => {
          let childIndex = 0;
          return (q.children || []).map((child) => {
            const isNumbered = isNumberedType(child.type);
            if (isNumbered) childIndex += 1;
            return (
              <Renderer
                key={child.id}
                q={child}
                index={isNumbered ? childIndex : -1}
                answers={answers}
                onAnswer={onAnswer}
                onToggle={onToggle}
                visibilityMap={visibilityMap}
                depth={depth + 1}
              />
            );
          });
        })()}
      </div>
    );
  }

  return (
    <div className="sv-question" style={{ marginLeft: depth * 20 }}>
      <div className="sv-question__badge">Q{index + 1}</div>
      <label className="sv-question__label" htmlFor={inputId}>
        {q.label}
        {req && <span className="sv-req" aria-hidden="true"> *</span>}
      </label>
      {q.hint && <p className="sv-question__hint">{q.hint}</p>}

      {(q.type === "text" || q.type === "email" || q.type === "phone" || q.type === "url" || q.type === "number") && (
        <input
          id={inputId}
          type={inputType(q.type)}
          className="sv-input"
          placeholder={q.placeholder}
          value={(val as string | number) ?? ""}
          min={q.type === "number" ? q.min : undefined}
          max={q.type === "number" ? q.max : undefined}
          onChange={(e) =>
            onAnswer(q.id, q.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
          }
          required={req}
        />
      )}

      {q.type === "textarea" && (
        <textarea
          id={inputId}
          className="sv-input sv-textarea"
          rows={4}
          placeholder={q.placeholder}
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          required={req}
        />
      )}

      {q.type === "date" && (
        <input
          id={inputId}
          type="date"
          className="sv-input"
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          required={req}
        />
      )}

      {q.type === "time" && (
        <input
          id={inputId}
          type="time"
          className="sv-input"
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          required={req}
        />
      )}

      {q.type === "select" && (
        <select
          id={inputId}
          className="sv-input sv-select"
          value={(val as string) ?? ""}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          required={req}
        >
          <option value="">Select an option…</option>
          {(q.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {q.type === "radio" && (
        <div className="sv-options" role="radiogroup" aria-labelledby={inputId}>
          {(q.options || []).map((opt) => (
            <label key={opt} className={`sv-option${val === opt ? " sv-option--selected" : ""}`}>
              <input
                type="radio"
                name={inputId}
                value={opt}
                checked={val === opt}
                onChange={() => onAnswer(q.id, opt)}
                required={req}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {q.type === "checkbox" && (
        <div className="sv-options sv-options--check" role="group" aria-labelledby={inputId}>
          {(q.options || []).map((opt) => {
            const checked = Array.isArray(val) && (val as string[]).includes(opt);
            return (
              <label key={opt} className={`sv-option sv-option--check${checked ? " sv-option--selected" : ""}`}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(q.id, opt)} />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {q.type === "rating" && (
        <div className="sv-stars" role="group" aria-label={q.label}>
          {Array.from({ length: q.maxRating ?? 5 }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              className="sv-star"
              onClick={() => onAnswer(q.id, star)}
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

function inputType(t: SurveyQuestion["type"]): string {
  switch (t) {
    case "email": return "email";
    case "phone": return "tel";
    case "url": return "url";
    case "number": return "number";
    default: return "text";
  }
}

const StarFill = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`sv-star-svg${filled ? " sv-star-svg--filled" : ""}`}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
