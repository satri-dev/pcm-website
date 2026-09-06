"use client";

import { useState } from "react";
import { WhyChooseReason } from "@/types/homepage";
import { Plus, Trash2, Save } from "lucide-react";
import { HardDeleteDialog } from "@/components/shared/delete-dialogs";

interface Props {
  reasons: WhyChooseReason[];
  onSave: (reasons: WhyChooseReason[]) => Promise<void>;
}

export default function ReasonsManager({ reasons, onSave }: Props) {
  const [items, setItems] = useState<WhyChooseReason[]>(reasons);
  const [saving, setSaving] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const update = (index: number, patch: Partial<WhyChooseReason>) => {
    setItems((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const remove = (index: number) => {
    setDeleteIdx(index);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(items);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Why Choose PCM</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            The 6 reason cards shown on the home page.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setItems((prev) => [...prev, { icon: "🎓", title: "", desc: "" }])
          }
          className="admin-btn"
        >
          <Plus size={14} /> Add Reason
        </button>
      </div>

      <div className="space-y-4">
        {items.map((reason, idx) => (
          <div
            key={idx}
            className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-[var(--admin-muted)]">
                Reason {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="admin-icon-btn"
                style={{ background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="form-grid">
              <div className="field" style={{ width: 80 }}>
                <label>Icon (emoji)</label>
                <input
                  value={reason.icon}
                  onChange={(e) => update(idx, { icon: e.target.value })}
                  placeholder="🎓"
                />
              </div>
              <div className="field">
                <label>Title</label>
                <input
                  value={reason.title}
                  onChange={(e) => update(idx, { title: e.target.value })}
                  placeholder="PU-affiliated degrees"
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <textarea
                  value={reason.desc}
                  onChange={(e) => update(idx, { desc: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
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

      <HardDeleteDialog
        open={deleteIdx !== null}
        onOpenChange={(open) => { if (!open) setDeleteIdx(null); }}
        onConfirm={() => {
          if (deleteIdx !== null) {
            setItems((prev) => prev.filter((_, i) => i !== deleteIdx));
            setDeleteIdx(null);
          }
        }}
        title="Delete Reason?"
        description="Are you sure you want to delete this reason? This action cannot be undone."
        confirmText="Delete Reason"
      />
    </div>
  );
}
