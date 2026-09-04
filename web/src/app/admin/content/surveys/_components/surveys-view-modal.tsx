"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Survey, SurveyQuestion } from "@/types/surveys";
import { Eye, X, Clock, CalendarDays } from "lucide-react";

interface SurveysViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey: Survey | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function QuestionPreview({
  question,
  index,
  showParentLabel = false,
}: {
  question: SurveyQuestion;
  index: number;
  showParentLabel?: boolean;
}) {
  const hasOptions =
    question.options && question.options.length > 0;
  const hasChildren =
    question.type === "group" && Array.isArray(question.children) && question.children.length > 0;

  return (
    <div className="p-3 border border-[var(--admin-line)] rounded-lg bg-[var(--admin-surface-2)]">
      <div className="flex items-start gap-2 mb-2">
        {showParentLabel && (
          <span className="text-xs font-bold text-[var(--admin-muted)] bg-[var(--admin-surface)] px-2 py-0.5 rounded">
            Sub
          </span>
        )}
        <span className="text-xs font-bold text-[var(--admin-muted)] bg-[var(--admin-surface)] px-2 py-0.5 rounded">
          Q{index + 1}
        </span>
        <span className="text-xs text-[var(--admin-muted)] bg-[var(--admin-surface)] px-2 py-0.5 rounded">
          {question.type}
        </span>
        {question.required && (
          <span className="text-xs text-[var(--admin-red)]">Required</span>
        )}
        {question.visibility && (
          <span className="text-xs text-[var(--admin-brand)] bg-[var(--admin-surface)] px-2 py-0.5 rounded">
            Conditional
          </span>
        )}
      </div>
      <p className="text-sm font-medium m-0 mb-1">{question.label}</p>
      {question.hint && (
        <p className="text-xs text-[var(--admin-muted)] m-0">{question.hint}</p>
      )}

      {question.visibility && (
        <p className="text-xs text-[var(--admin-brand)] mt-1 m-0">
          Show when {question.visibility.parentId}{" "}
          {question.visibility.operator}
          {question.visibility.value !== undefined && (
            <>
              {" "}
              ={" "}
              {Array.isArray(question.visibility.value)
                ? question.visibility.value.join(", ")
                : String(question.visibility.value)}
            </>
          )}
        </p>
      )}

      {question.placeholder !== undefined && question.placeholder !== "" && (
        <p className="text-xs text-[var(--admin-muted)] mt-1 m-0">
          Placeholder: {question.placeholder}
        </p>
      )}

      {question.type === "number" &&
        (question.min !== undefined || question.max !== undefined) && (
          <p className="text-xs text-[var(--admin-muted)] mt-1 m-0">
            Range: {question.min ?? "–"} to {question.max ?? "–"}
          </p>
        )}

      {hasOptions && (
        <div className="mt-2 space-y-1">
          {question.options!.map((opt, i) => (
            <div key={i} className="text-xs text-[var(--admin-muted)] flex items-center gap-2">
              <span
                className={`w-3 h-3 border ${
                  question.type === "checkbox"
                    ? "rounded-sm"
                    : "rounded-full"
                } border-[var(--admin-line)] inline-block`}
              />
              {opt}
            </div>
          ))}
        </div>
      )}
      {question.type === "rating" && (
        <div className="mt-2 text-xs text-[var(--admin-muted)]">
          Rating: 1 to {question.maxRating || 5} stars
        </div>
      )}

      {/* Nested children (group = field within field) */}
      {hasChildren && (
        <div className="mt-3 space-y-2 pl-2 border-l-2 border-[var(--admin-brand)]">
          {question.children!.map((child, i) => (
            <QuestionPreview key={child.id} question={child} index={i} showParentLabel />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SurveysViewModal({
  open,
  onOpenChange,
  survey,
}: SurveysViewModalProps) {
  if (!survey) return null;

  const statusBadge = survey.status === "published" ? "green" : "gold";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="surveys-modal w-[min(100%,720px)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} />
            View Survey
          </DialogTitle>
          <button
            type="button"
            className="admin-icon-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">{survey.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="badge badge--blue">{survey.category}</span>
                <span className={`badge badge--${statusBadge} lowercase`}>
                  {survey.status}
                </span>
                {survey.featured && (
                  <span className="badge badge--gold">Featured</span>
                )}
              </div>
              <h3 className="m-0 text-xl font-bold text-[var(--admin-ink)]">
                {survey.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              Created {formatDate(survey.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              ~{survey.timeToRead} min read
            </span>
            {survey.endsOn && (
              <span className="inline-flex items-center gap-1.5 text-[var(--admin-red)]">
                Ends {formatDate(survey.endsOn)}
              </span>
            )}
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Slug</dt>
            <dd className="m-0 text-[var(--admin-muted)] break-all">
              {survey.slug}
            </dd>
            <dt className="font-semibold">Questions</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {survey.questions.length}
            </dd>
          </dl>

          {survey.excerpt && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Excerpt
              </h4>
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: survey.excerpt }}
              />
            </section>
          )}

          {survey.questions.length > 0 && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Questions ({survey.questions.length})
              </h4>
              <div className="space-y-2">
                {survey.questions.map((q, i) => (
                  <QuestionPreview key={q.id} question={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {survey.tags && survey.tags.length > 0 && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Tags
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                {survey.tags.map((tag) => (
                  <span key={tag} className="badge badge--gray">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {survey.seo &&
            (survey.seo.title || survey.seo.description || survey.seo.keywords) && (
              <section>
                <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                  SEO
                </h4>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 text-sm">
                  {survey.seo.title && (
                    <>
                      <dt className="font-semibold">Title</dt>
                      <dd className="m-0 text-[var(--admin-muted)]">
                        {survey.seo.title}
                      </dd>
                    </>
                  )}
                  {survey.seo.description && (
                    <>
                      <dt className="font-semibold">Description</dt>
                      <dd className="m-0 text-[var(--admin-muted)]">
                        {survey.seo.description}
                      </dd>
                    </>
                  )}
                  {survey.seo.keywords && survey.seo.keywords.length > 0 && (
                    <>
                      <dt className="font-semibold">Keywords</dt>
                      <dd className="m-0 text-[var(--admin-muted)]">
                        {survey.seo.keywords.join(", ")}
                      </dd>
                    </>
                  )}
                </dl>
              </section>
            )}
        </div>

        {/* Footer */}
        <div className="modal__foot">
          <button
            type="button"
            className="admin-btn"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}