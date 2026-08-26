"use client";

import type { Subject, SubjectResult } from "../types";
import SubjectRow from "./SubjectRow";

interface Props {
  subjects:        Subject[];
  results:         SubjectResult[];
  onAddSubject:    () => void;
  onRemoveSubject: (id: string) => void;
  onClearAll:      () => void;
  onCalculate:     () => void;
  onUpdateSubject: (id: string, field: keyof Subject, value: string) => void;
}

const CalcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 10h8M8 14h4" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

export default function SubjectTable({
  subjects, results, onAddSubject, onRemoveSubject, onClearAll, onCalculate, onUpdateSubject,
}: Props) {
  const resultMap = Object.fromEntries(results.map((r) => [r.id, r]));

  return (
    <div className="gpa-table-wrap">
      {/* Column headers — visible on wide screens */}
      <div className="gpa-table-head" aria-hidden="true">
        <span className="gpa-head-num">#</span>
        <span>Subject Name</span>
        <span className="gpa-head-sm">Credits</span>
        <span className="gpa-head-sm">Theory Full</span>
        <span className="gpa-head-sm">Practical Full</span>
        <span className="gpa-head-sm">Theory Obtained</span>
        <span className="gpa-head-sm">Practical Obtained</span>
        <span className="gpa-head-grade">Grade</span>
        <span className="gpa-head-remove"></span>
      </div>

      <p className="gpa-table-note">
        <strong>Theory Full</strong> = theory exam marks (e.g. 60, 80).&nbsp;
        <strong>Practical Full</strong> = internal/lab marks (0 if none).&nbsp;
        Percentage = (Theory Obtained + Practical Obtained) ÷ (Theory Full + Practical Full) × 100.
      </p>

      <div className="gpa-rows" role="table" aria-label="Subject marks">
        {subjects.map((s, i) => (
          <SubjectRow
            key={s.id}
            subject={s}
            result={resultMap[s.id]}
            index={i}
            canRemove={subjects.length > 1}
            onChange={onUpdateSubject}
            onRemove={onRemoveSubject}
          />
        ))}
      </div>

      <div className="gpa-actions">
        <button type="button" className="gpa-btn gpa-btn-primary" onClick={onAddSubject}>
          <PlusIcon /> Add Subject
        </button>
        <button type="button" className="gpa-btn gpa-btn-ghost" onClick={onClearAll}>
          <TrashIcon /> Clear All
        </button>
        <span className="gpa-subject-count">
          {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
        </span>
      </div>
      {/* Primary action — Calculate */}
      <div className="gpa-calculate-wrap">
        <button type="button" className="gpa-btn gpa-btn-calculate" onClick={onCalculate}>
          <CalcIcon /> Calculate GPA
        </button>
      </div>
    </div>
  );
}
