"use client";

import type { SurveyQuestion, QuestionCondition } from "@/types/surveys";
import type { SurveyAnswerValue } from "@/types/survey-response";
import { Check, Minus, Star } from "lucide-react";

type Answers = Record<string, SurveyAnswerValue>;

function matchesCondition(condition: QuestionCondition, answers: Answers): boolean {
  const raw = answers[condition.parentId];
  const values = Array.isArray(raw) ? raw.map(String) : raw === undefined || raw === null ? [] : [String(raw)];
  const wanted = condition.value;
  switch (condition.operator) {
    case "equals": return values.some((v) => v === (wanted === undefined ? "" : String(wanted)));
    case "notEquals": { const t = wanted === undefined ? "" : String(wanted); return values.length > 0 && !values.some((v) => v === t); }
    case "contains": return values.some((v) => v.toLowerCase().includes(String(wanted ?? "").toLowerCase()));
    case "notContains": return values.length > 0 && !values.some((v) => v.toLowerCase().includes(String(wanted ?? "").toLowerCase()));
    case "in": return Array.isArray(wanted) && values.some((v) => wanted.includes(v));
    case "notIn": return values.length > 0 && Array.isArray(wanted) && !values.some((v) => wanted.includes(v));
    case "empty": return values.length === 0 || values.every((v) => !v.trim());
    case "notEmpty": return values.length > 0 && values.some((v) => v.trim().length > 0);
    default: return true;
  }
}

function flatten(questions: SurveyQuestion[]): SurveyQuestion[] {
  const out: SurveyQuestion[] = [];
  for (const q of questions || []) {
    out.push(q);
    if (q.children?.length) out.push(...flatten(q.children));
  }
  return out;
}

function isVisible(q: SurveyQuestion, all: SurveyQuestion[], answers: Answers): boolean {
  if (!q.visibility) return true;
  const parent = flatten(all).find((f) => f.id === q.visibility!.parentId);
  if (!parent) return true;
  return matchesCondition(q.visibility, answers);
}

function isAnswerable(q: SurveyQuestion): boolean {
  return q.type !== "section" && q.type !== "description" && q.type !== "group";
}

function displayValue(q: SurveyQuestion, value: SurveyAnswerValue | undefined): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function RatingStars({ value, max }: { value: number; max: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? "fill-[var(--admin-gold)] text-[var(--admin-gold)]" : "text-[var(--admin-line)]"}
        />
      ))}
    </span>
  );
}

function ChoiceList({ choices }: { choices: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {choices.map((c, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--admin-brand)]/10 text-[var(--admin-brand)] px-2 py-0.5 text-[0.8rem] font-medium"
        >
          <Check size={12} /> {c}
        </span>
      ))}
    </div>
  );
}

function AnswerBlock({
  q,
  answers,
  numberedNo,
}: {
  q: SurveyQuestion;
  answers: Answers;
  numberedNo: number;
}) {
  // Note blocks: show the heading, no answer row.
  if (q.type === "section" || q.type === "description") {
    return (
      <div className="rounded-lg border border-dashed border-[var(--admin-line)] bg-[var(--admin-surface-2)] px-4 py-3 mb-3">
        <p className="m-0 text-[0.95rem] font-semibold text-[var(--admin-ink)]">{q.label || (q.type === "section" ? "Section" : "Description")}</p>
        {q.hint && <p className="m-0 mt-0.5 text-[0.8rem] text-[var(--admin-muted)]">{q.hint}</p>}
      </div>
    );
  }

  // Group: container of children.
  if (q.type === "group") {
    if (q.children && q.children.length > 0) {
      return (
        <div className="rounded-xl border border-[var(--admin-line)] bg-white p-4 mb-3">
          {q.label && (
            <div className="mb-2">
              <p className="m-0 text-[0.95rem] font-semibold text-[var(--admin-brand)]">{q.label}</p>
              {q.hint && <p className="m-0 text-[0.8rem] text-[var(--admin-muted)]">{q.hint}</p>}
            </div>
          )}
          <SubGroup questions={q.children} answers={answers} depth={1} />
        </div>
      );
    }
    return null;
  }

  // Answerable question.
  const value = answers[q.id];
  const answered = value !== undefined && value !== null &&
    (!Array.isArray(value) || value.length > 0) && value !== "";

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[var(--admin-line)] last:border-b-0">
      <span className="mt-0.5 shrink-0 inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-[var(--admin-surface-2)] text-[0.72rem] font-bold text-[var(--admin-muted)]">
        {numberedNo}
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[0.85rem] font-medium text-[var(--admin-ink)]">
          {q.label}
          {q.required && <span className="text-[var(--admin-red)]"> *</span>}
        </p>
        {q.hint && <p className="m-0 text-[0.75rem] text-[var(--admin-muted)]">{q.hint}</p>}
        <div className="mt-1.5">
          {answered ? (
            renderAnswer(q, value)
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-[var(--admin-muted)]">
              <Minus size={13} /> Not answered
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function renderAnswer(q: SurveyQuestion, value: SurveyAnswerValue) {
  if (Array.isArray(value)) {
    return <ChoiceList choices={value.map(String)} />;
  }
  if (q.type === "rating") {
    return <RatingStars value={Number(value) || 0} max={q.maxRating || 5} />;
  }
  if (q.type === "email" || q.type === "url" || q.type === "phone") {
    const v = String(value);
    const href = q.type === "email" ? `mailto:${v}` : q.type === "url" ? (v.startsWith("http") ? v : `https://${v}`) : `tel:${v}`;
    return (
      <a href={href} className="text-[var(--admin-brand)] underline break-all text-[0.85rem]">{v}</a>
    );
  }
  return <p className="m-0 text-[0.85rem] text-[var(--admin-ink)] whitespace-pre-wrap break-words">{displayValue(q, value)}</p>;
}

function SubGroup({ questions, answers, depth }: { questions: SurveyQuestion[]; answers: Answers; depth: number }) {
  let numberedNo = 0;
  const all = questions;
  return (
    <>
      {questions.map((q) => {
        const isNum = isAnswerable(q);
        const show = isVisible(q, all, answers);
        // Skip hidden conditional answerable questions (Google Forms hides them).
        if (isNum || q.type === "section" || q.type === "description") {
          if (!show) return <div key={q.id} />;
        }
        if (isNum) numberedNo += 1;
        const num = isNum ? numberedNo : -1;
        return (
          <div key={q.id} style={depth > 1 ? { marginLeft: 16 } : undefined}>
            <AnswerBlock q={q} answers={answers} numberedNo={num} />
            {q.type === "group" && q.children?.length ? (
              <div className="mt-1"><SubGroup questions={q.children} answers={answers} depth={depth + 1} /></div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default function SurveyResponseView({
  questions,
  answers,
}: {
  questions: SurveyQuestion[];
  answers: Record<string, SurveyAnswerValue>;
}) {
  return (
    <div className="divide-y divide-[var(--admin-line)]">
      <SubGroup questions={questions || []} answers={answers} depth={0} />
    </div>
  );
}
