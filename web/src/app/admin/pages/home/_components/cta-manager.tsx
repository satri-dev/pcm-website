"use client";

import { useState } from "react";
import { CTAConfig } from "@/types/homepage";
import { Save } from "lucide-react";

interface Props {
  cta: CTAConfig;
  onSave: (cta: CTAConfig) => Promise<void>;
}

export default function CTAManager({ cta, onSave }: Props) {
  const [data, setData] = useState<CTAConfig>(cta);
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
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">CTA Banner</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            The call-to-action banner at the bottom of the home page.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
            placeholder="Enter to Learn — Go Forth to Serve"
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Heading</label>
          <input
            value={data.heading}
            onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))}
            placeholder="A step towards your future"
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
            rows={2}
          />
        </div>

        {/* Primary button */}
        <div className="field">
          <label>Primary button label</label>
          <input
            value={data.primaryButton.label}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                primaryButton: { ...d.primaryButton, label: e.target.value },
              }))
            }
          />
        </div>
        <div className="field">
          <label>Primary button href</label>
          <input
            value={data.primaryButton.href}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                primaryButton: { ...d.primaryButton, href: e.target.value },
              }))
            }
          />
        </div>

        {/* Secondary button */}
        <div className="field">
          <label>Secondary button label</label>
          <input
            value={data.secondaryButton.label}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                secondaryButton: { ...d.secondaryButton, label: e.target.value },
              }))
            }
          />
        </div>
        <div className="field">
          <label>Secondary button href</label>
          <input
            value={data.secondaryButton.href}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                secondaryButton: { ...d.secondaryButton, href: e.target.value },
              }))
            }
          />
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
