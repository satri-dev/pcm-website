"use client";

import type { Subject, SubjectResult } from "../types";
import { GRADE_COLORS } from "../data/grading";

interface Props {
  subject:    Subject;
  result?:    SubjectResult;
  index:      number;
  canRemove:  boolean;
  onChange:   (id: string, field: keyof Subject, value: string) => void;
  onRemove:   (id: string) => void;
}

const RemoveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default function SubjectRow({ subject, result, index, canRemove, onChange, onRemove }: Props) {
  const hasResult  = result && !isNaN(result.gradePoint);
  const gradeColor = hasResult ? (GRADE_COLORS[result.grade] ?? "#718096") : undefined;

  const thFull  = parseFloat(subject.theoryFullMarks) || 0;
  const prFull  = parseFloat(subject.practicalFullMarks) || 0;

  const thObt   = parseFloat(subject.theoryObtained);
  const prObt   = parseFloat(subject.practicalObtained) || 0;

  const hasPractical = prFull > 0;

  // Highlight inputs that are below their individual pass mark (after calculate)
  const theoryBelowPass    = hasResult && result.failedPassMark && !isNaN(thObt) && thFull > 0 && thObt < thFull * 0.4;
  const practicalBelowPass = hasResult && result.failedPassMark && hasPractical && prObt < prFull * 0.4;

  return (
    <div className="gpa-row">
      {/* Row number */}
      <span className="gpa-row-num" aria-hidden="true">{index + 1}</span>

      {/* Subject name */}
      <div className="gpa-field gpa-field--name">
        <label htmlFor={`name-${subject.id}`} className="gpa-field-label">Subject Name</label>
        <input
          id={`name-${subject.id}`}
          type="text"
          className="gpa-input"
          placeholder="e.g. Business Mathematics"
          value={subject.name}
          onChange={(e) => onChange(subject.id, "name", e.target.value)}
          maxLength={60}
        />
      </div>

      {/* All numeric fields — wrapped so mobile CSS can grid them compactly */}
      <div className="gpa-row-fields">
        {/* Credit hours */}
        <div className="gpa-field gpa-field--sm">
          <label htmlFor={`cr-${subject.id}`} className="gpa-field-label">Credits</label>
          <input
            id={`cr-${subject.id}`}
            type="number"
            className="gpa-input"
            placeholder="3"
            min="1" max="6" step="0.5"
            value={subject.creditHours}
            onChange={(e) => onChange(subject.id, "creditHours", e.target.value)}
          />
        </div>

        {/* Theory full marks */}
        <div className="gpa-field gpa-field--sm">
          <label htmlFor={`tf-${subject.id}`} className="gpa-field-label">Theory Full</label>
          <input
            id={`tf-${subject.id}`}
            type="number"
            className="gpa-input"
            placeholder="60"
            min="1" max="200"
            value={subject.theoryFullMarks}
            onChange={(e) => onChange(subject.id, "theoryFullMarks", e.target.value)}
          />
        </div>

        {/* Practical full marks */}
        <div className="gpa-field gpa-field--sm">
          <label htmlFor={`pf-${subject.id}`} className="gpa-field-label">Practical Full</label>
          <input
            id={`pf-${subject.id}`}
            type="number"
            className="gpa-input"
            placeholder="0"
            min="0" max="100"
            value={subject.practicalFullMarks}
            onChange={(e) => onChange(subject.id, "practicalFullMarks", e.target.value)}
          />
        </div>

        {/* Theory obtained */}
        <div className="gpa-field gpa-field--sm">
          <label htmlFor={`to-${subject.id}`} className="gpa-field-label">Theory Obtained</label>
          <input
            id={`to-${subject.id}`}
            type="number"
            className={`gpa-input${theoryBelowPass ? " gpa-input--error" : ""}`}
            placeholder="e.g. 45"
            min="0"
            max={thFull > 0 ? thFull : undefined}
            value={subject.theoryObtained}
            onChange={(e) => {
              const raw = parseFloat(e.target.value);
              const clamped = !isNaN(raw) && thFull > 0 && raw > thFull
                ? String(thFull)
                : e.target.value;
              onChange(subject.id, "theoryObtained", clamped);
            }}
            aria-invalid={theoryBelowPass}
          />
        </div>

        {/* Practical obtained */}
        <div className="gpa-field gpa-field--sm">
          <label htmlFor={`po-${subject.id}`} className="gpa-field-label">Practical Obtained</label>
          <input
            id={`po-${subject.id}`}
            type="number"
            className={`gpa-input${practicalBelowPass ? " gpa-input--error" : ""}`}
            placeholder="0"
            min="0"
            max={prFull > 0 ? prFull : undefined}
            value={subject.practicalObtained}
            disabled={!hasPractical}
            onChange={(e) => {
              const raw = parseFloat(e.target.value);
              const clamped = !isNaN(raw) && prFull > 0 && raw > prFull
                ? String(prFull)
                : e.target.value;
              onChange(subject.id, "practicalObtained", clamped);
            }}
            style={!hasPractical ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
            aria-invalid={practicalBelowPass}
          />
        </div>

        {/* Auto grade badge */}
        <div className="gpa-field gpa-field--grade">
          <span className="gpa-field-label" aria-hidden="true">Grade</span>
          {hasResult ? (
            <span
              className="gpa-grade-badge"
              style={{ background: gradeColor }}
              aria-label={`Grade ${result.grade}`}
            >
              {result.grade}
            </span>
          ) : (
            <span className="gpa-grade-badge gpa-grade-badge--empty">—</span>
          )}
        </div>
      </div>

      {/* Remove button */}
      <div className="gpa-field gpa-field--remove">
        <button
          type="button"
          className={`gpa-remove-btn${!canRemove ? " gpa-remove-btn--disabled" : ""}`}
          onClick={() => onRemove(subject.id)}
          disabled={!canRemove}
          aria-label={`Remove ${subject.name || `subject ${index + 1}`}`}
          title={canRemove ? "Remove this subject" : "At least one subject is required"}
        >
          <RemoveIcon />
        </button>
      </div>
    </div>
  );
}
