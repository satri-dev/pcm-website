"use client";

import { Save } from "lucide-react";

export function SectionSaveButton({
  id,
  saving,
  error,
  onSave,
}: {
  id: string;
  saving: boolean;
  error?: string;
  onSave: (id: string) => void;
}) {
  return (
    <div className="pp-section__save">
      {error && <span className="pp-section__save-error">{error}</span>}
      <button
        type="button"
        className="admin-btn admin-btn--primary"
        onClick={() => onSave(id)}
        disabled={saving}
      >
        <Save size={15} />
        {saving ? "Saving..." : "Save Section"}
      </button>
    </div>
  );
}