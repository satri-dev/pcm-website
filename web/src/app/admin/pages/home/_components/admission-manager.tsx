"use client";

import { useState } from "react";
import { AdmissionConfig, AdmissionStep, AdmissionDetail } from "@/types/homepage";
import { Plus, Trash2, Save } from "lucide-react";

interface Props {
  admission: AdmissionConfig;
  onSave: (admission: AdmissionConfig) => Promise<void>;
}

export default function AdmissionManager({ admission, onSave }: Props) {
  const [data, setData] = useState<AdmissionConfig>(admission);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Admission Section</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            Configure the admission steps and details sidebar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Header fields */}
      <div className="form-grid mb-6">
        <div className="field">
          <label>Badge text</label>
          <input
            value={data.badge}
            onChange={(e) => setData((d) => ({ ...d, badge: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Heading</label>
          <input
            value={data.heading}
            onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))}
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Subheading</label>
          <textarea
            value={data.subheading}
            onChange={(e) => setData((d) => ({ ...d, subheading: e.target.value }))}
            rows={2}
          />
        </div>
        <div className="field">
          <label>Poster image path</label>
          <input
            value={data.posterImage}
            onChange={(e) => setData((d) => ({ ...d, posterImage: e.target.value }))}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-[var(--admin-ink)] m-0">Admission Steps</h4>
          <button
            type="button"
            onClick={() =>
              setData((d) => ({
                ...d,
                steps: [...d.steps, { number: String(d.steps.length + 1).padStart(2, "0"), title: "", description: "" }],
              }))
            }
            className="admin-btn text-xs"
          >
            <Plus size={12} /> Add Step
          </button>
        </div>
        <div className="space-y-3">
          {data.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-start border border-[var(--admin-border)] rounded-lg p-4 bg-[var(--admin-surface)]"
            >
              <div className="field" style={{ width: 60 }}>
                <label>#</label>
                <input
                  value={step.number}
                  onChange={(e) => {
                    const steps = [...data.steps];
                    steps[idx] = { ...steps[idx], number: e.target.value };
                    setData((d) => ({ ...d, steps }));
                  }}
                />
              </div>
              <div className="field flex-1">
                <label>Title</label>
                <input
                  value={step.title}
                  onChange={(e) => {
                    const steps = [...data.steps];
                    steps[idx] = { ...steps[idx], title: e.target.value };
                    setData((d) => ({ ...d, steps }));
                  }}
                />
              </div>
              <div className="field flex-1">
                <label>Description</label>
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const steps = [...data.steps];
                    steps[idx] = { ...steps[idx], description: e.target.value };
                    setData((d) => ({ ...d, steps }));
                  }}
                  rows={2}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setData((d) => ({
                    ...d,
                    steps: d.steps.filter((_, i) => i !== idx),
                  }));
                }}
                className="admin-icon-btn text-red-500 hover:text-red-700 mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-[var(--admin-ink)] m-0">Details Sidebar</h4>
          <button
            type="button"
            onClick={() =>
              setData((d) => ({
                ...d,
                details: [...d.details, { label: "", value: "" }],
              }))
            }
            className="admin-btn text-xs"
          >
            <Plus size={12} /> Add Detail
          </button>
        </div>
        <div className="space-y-2">
          {data.details.map((detail, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-center"
            >
              <input
                value={detail.label}
                onChange={(e) => {
                  const details = [...data.details];
                  details[idx] = { ...details[idx], label: e.target.value };
                  setData((d) => ({ ...d, details }));
                }}
                placeholder="Label"
                className="flex-1"
              />
              <input
                value={detail.value}
                onChange={(e) => {
                  const details = [...data.details];
                  details[idx] = { ...details[idx], value: e.target.value };
                  setData((d) => ({ ...d, details }));
                }}
                placeholder="Value"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  setData((d) => ({
                    ...d,
                    details: d.details.filter((_, i) => i !== idx),
                  }));
                }}
                className="admin-icon-btn text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
