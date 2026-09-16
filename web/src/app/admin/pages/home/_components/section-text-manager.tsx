"use client";

import { useState } from "react";
import { SectionText } from "@/types/homepage";
import { Save } from "lucide-react";

interface Props {
  label: string;
  data: SectionText;
  onSave: (text: SectionText) => Promise<void>;
  defaults: SectionText;
}

export default function SectionTextManager({ label, data, onSave, defaults }: Props) {
  const [text, setText] = useState<SectionText>(data ?? defaults);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(text);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">{label}</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            The badge, heading, description and link for this section.
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

      <div className="form-grid">
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Badge text</label>
          <input
            value={text.badge}
            onChange={(e) => setText((t) => ({ ...t, badge: e.target.value }))}
            placeholder={defaults.badge}
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Heading</label>
          <input
            value={text.heading}
            onChange={(e) => setText((t) => ({ ...t, heading: e.target.value }))}
            placeholder={defaults.heading}
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Description</label>
          <textarea
            value={text.description}
            onChange={(e) => setText((t) => ({ ...t, description: e.target.value }))}
            rows={3}
          />
        </div>
        <div className="field">
          <label>Link label</label>
          <input
            value={text.linkLabel}
            onChange={(e) => setText((t) => ({ ...t, linkLabel: e.target.value }))}
            placeholder={defaults.linkLabel}
          />
        </div>
        <div className="field">
          <label>Link href</label>
          <input
            value={text.linkHref}
            onChange={(e) => setText((t) => ({ ...t, linkHref: e.target.value }))}
            placeholder={defaults.linkHref}
          />
        </div>
      </div>
    </div>
  );
}
