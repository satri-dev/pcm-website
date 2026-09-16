"use client";

import { useState } from "react";
import { FacilitiesText } from "@/types/homepage";
import { Save } from "lucide-react";

interface Props {
  facilitiesText: FacilitiesText;
  onSave: (text: FacilitiesText) => Promise<void>;
}

export default function FacilitiesTextManager({ facilitiesText, onSave }: Props) {
  const [text, setText] = useState<FacilitiesText>(facilitiesText ?? { badge: "Our campus", heading: "Facilities designed around you", description: "", linkLabel: "All facilities", linkHref: "/facilities" });
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
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Facilities Section Header</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            The badge, heading, description and link for the Facilities section.
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
            placeholder="Our campus"
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Heading</label>
          <input
            value={text.heading}
            onChange={(e) => setText((t) => ({ ...t, heading: e.target.value }))}
            placeholder="Facilities designed around you"
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
            placeholder="All facilities"
          />
        </div>
        <div className="field">
          <label>Link href</label>
          <input
            value={text.linkHref}
            onChange={(e) => setText((t) => ({ ...t, linkHref: e.target.value }))}
            placeholder="/facilities"
          />
        </div>
      </div>
    </div>
  );
}
