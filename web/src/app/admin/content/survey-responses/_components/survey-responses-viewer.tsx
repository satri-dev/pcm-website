"use client";

import { useMemo, useState } from "react";
import { Survey } from "@/types/surveys";
import { SurveyResponse } from "@/types/survey-response";
import { ChevronLeft, ChevronRight, Trash2, ArrowLeft, ClipboardList } from "lucide-react";
import SurveyResponseView from "./survey-response-view";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

interface Props {
  survey: Survey;
  responses: SurveyResponse[];
  total: number;
  onBack: () => void;
  onRequestDelete: (response: SurveyResponse) => void;
}

export default function SurveyResultsViewer({ survey, responses, total, onBack, onRequestDelete }: Props) {
  const [index, setIndex] = useState(0);
  const safeIndex = responses.length ? Math.min(Math.max(index, 0), responses.length - 1) : 0;
  const current = responses[safeIndex] ?? null;

  const respondentName = useMemo(
    () => (current?.respondent?.trim() ? current.respondent.trim() : "Anonymous"),
    [current]
  );

  return (
    <div className="admin-panel overflow-hidden">
      {/* Viewer header */}
      <div className="admin-panel__head flex flex-wrap items-center gap-3 !p-4" style={{ borderBottom: "1px solid var(--admin-line)" }}>
        <button type="button" className="admin-icon-btn" onClick={onBack} title="Back to overview">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{survey.icon || "📋"}</span>
            <h3 className="m-0 text-[1.05rem] font-bold text-[var(--admin-ink)] truncate">{survey.title}</h3>
            <span className="badge badge--blue lowercase">/{survey.slug}</span>
          </div>
          <p className="m-0 mt-0.5 text-[0.8rem] text-[var(--admin-muted)]">
            {total} response{total === 1 ? "" : "s"} · viewing response {responses.length ? safeIndex + 1 : 0} of {responses.length}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            disabled={responses.length <= 1 || safeIndex === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft size={15} /> Prev
          </button>
          <span className="text-sm text-[var(--admin-muted)] tabular-nums">
            {responses.length ? `${safeIndex + 1} / ${responses.length}` : "0 / 0"}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            disabled={responses.length <= 1 || safeIndex >= responses.length - 1}
            onClick={() => setIndex((i) => Math.min(responses.length - 1, i + 1))}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="admin-panel__body p-0">
        {!current ? (
          <div className="flex flex-col items-center py-16 text-center px-6">
            <ClipboardList size={40} className="opacity-30 mb-4" />
            <p className="m-0 text-[0.95rem] text-[var(--admin-muted)]">
              No responses have been submitted for this survey yet.
            </p>
            <button
              type="button"
              className="admin-btn mt-5"
              onClick={onBack}
            >
              <ArrowLeft size={15} /> Back to overview
            </button>
          </div>
        ) : (
          <>
            {/* Response meta bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              style={{ borderBottom: "1px solid var(--admin-line)", background: "var(--admin-surface-2)" }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="avatar-sm">{respondentName.substring(0, 2).toUpperCase()}</span>
                <div>
                  <div className="text-sm font-semibold text-[var(--admin-ink)]">{respondentName}</div>
                  <div className="text-[0.75rem] text-[var(--admin-muted)]">
                    Submitted {formatDateTime(current.createdAt)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="act-btn danger"
                onClick={() => onRequestDelete(current)}
                title="Delete response"
              >
                <Trash2 size={15} /> <span className="text-[0.8rem]">Delete</span>
              </button>
            </div>

            {/* Answers */}
            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
              <SurveyResponseView questions={survey.questions || []} answers={current.answers || {}} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
